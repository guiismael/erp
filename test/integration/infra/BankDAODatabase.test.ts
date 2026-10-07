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
    name: 'name',
    url: 'url',
  })
  const listBank = await bankDao.list()
  const exists = listBank.find((bankData) => bankData.bank_id === bankId)
  expect(exists).toBeTruthy()
  expect(exists!.code).toBe('123')
  expect(exists!.name).toBe('name')
  expect(exists!.url).toBe('url')
  await bankDao.update({
    id: bankId,
    code: '321',
    name: 'altered',
    url: 'altered',
  })
  const bankUpdated = await bankDao.getById(bankId)
  expect(bankUpdated).toBeTruthy()
  expect(bankUpdated!.code).toBe('321')
  expect(bankUpdated!.name).toBe('altered')
  expect(bankUpdated!.url).toBe('altered')
  await bankDao.remove(bankId)
  const bankData = await bankDao.getById(bankId)
  expect(bankData).toBeFalsy()
})

test('Deve retornar um banco pelo código', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  await connection.query(`DELETE FROM banks WHERE code = ? `, [fakeCode])
  const bankId = await bankDao.save({
    code: fakeCode,
    name: 'name',
    url: 'url',
  })
  const savedBank = await bankDao.getByCode(fakeCode)
  expect(savedBank).toBeTruthy()
  expect(savedBank!.bank_id).toBe(bankId)
  expect(savedBank!.code).toBe(fakeCode)
  expect(savedBank!.name).toBe('name')
  expect(savedBank!.url).toBe('url')
  await bankDao.remove(bankId)
})

test('should be able to thrown an error if bank id isnt a number ', async () => {
  await expect(bankDao.remove('asd' as any)).rejects.toThrow('Invalid bank id.')
})
