import { ApplicationError } from '@ApplicationError.ts'
import { BankDAO, BankDAODatabase } from '@BankDAO.ts'
import mysqlConnection from 'mysql2/promise'

let bankDao: BankDAO
const connection = mysqlConnection.createPool(String(process.env.DATABASE_URL))

beforeAll(() => {
  bankDao = new BankDAODatabase()
})

afterAll(() => {
  connection.pool.end()
})

test('should be able to test bank access', async () => {
  const bankId = await bankDao.save({
    code: '123',
    name: 'Test Bank',
    url: 'url.com',
  })
  const listBank = await bankDao.list()
  const exists = listBank.find((bankData) => bankData.bank_id === bankId)
  expect(exists).toBeTruthy()
  expect(exists!.code).toBe('123')
  expect(exists!.name).toBe('Test Bank')
  expect(exists!.url).toBe('url.com')
  await bankDao.update({
    id: bankId,
    code: '321',
    name: 'Test Bank Updated',
    url: 'updated.com',
  })
  const bankUpdated = await bankDao.getById(bankId)
  expect(bankUpdated).toBeTruthy()
  expect(bankUpdated!.code).toBe('321')
  expect(bankUpdated!.name).toBe('Test Bank Updated')
  expect(bankUpdated!.url).toBe('updated.com')
  await bankDao.remove(bankId)
  const bankData = await bankDao.getById(bankId)
  expect(bankData).toBeFalsy()
})

test('should be able to return a bank by code', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  await connection.query(`DELETE FROM banks WHERE code = ? `, [fakeCode])
  const bankId = await bankDao.save({
    code: fakeCode,
    name: 'Test Bank',
    url: 'url.com',
  })
  const savedBank = await bankDao.getByCode(fakeCode)
  expect(savedBank).toBeTruthy()
  expect(savedBank!.bank_id).toBe(bankId)
  expect(savedBank!.code).toBe(fakeCode)
  expect(savedBank!.name).toBe('Test Bank')
  expect(savedBank!.url).toBe('url.com')
  await bankDao.remove(bankId)
})

test('should be able to return a bank by name', async () => {
  const fakeName = `Name ${Math.random()}`
  const bankId = await bankDao.save({
    code: '123',
    name: fakeName,
    url: 'url.com',
  })
  const savedBank = await bankDao.getByName(fakeName)
  expect(savedBank).toBeTruthy()
  expect(savedBank!.bank_id).toBe(bankId)
  expect(savedBank!.code).toBe('123')
  expect(savedBank!.name).toBe(fakeName)
  expect(savedBank!.url).toBe('url.com')
  await bankDao.remove(bankId)
})

test('should be able to thrown an error if bank id isnt a number on bank remove', async () => {
  await expect(bankDao.remove('asd' as any)).rejects.toThrow(
    new ApplicationError('Invalid bank id.'),
  )
})
