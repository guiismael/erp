import { ApplicationError } from '@ApplicationError.ts'
import { BankDAO } from '@BankDAO.ts'
import { BankDAOSQL } from '@BankDAOSQL.ts'
import { DatabaseConnection } from '@DatabaseConnection.ts'
import { PostgreSQLAdapter } from '@PostgreSQLAdapter.ts'
import Sinon from 'sinon'

let sut: BankDAO
let connection: DatabaseConnection

beforeAll(() => {
  connection = new PostgreSQLAdapter(String(process.env.DATABASE_URL_PG))
  sut = new BankDAOSQL(connection)
})

afterAll(async () => {
  await connection.close()
})

test('should be able to test bank access', async () => {
  const bankId = await sut.save({
    code: '123',
    name: 'Test Bank',
    url: 'url.com',
  })
  const listBank = await sut.list()
  const exists = listBank.find((bankData) => bankData.bank_id === bankId)
  expect(exists).toBeTruthy()
  expect(exists!.code).toBe('123')
  expect(exists!.name).toBe('Test Bank')
  expect(exists!.url).toBe('url.com')
  await sut.update({
    id: bankId,
    code: '321',
    name: 'Test Bank Updated',
    url: 'updated.com',
  })
  const bankUpdated = await sut.getById(bankId)
  expect(bankUpdated).toBeTruthy()
  expect(bankUpdated!.code).toBe('321')
  expect(bankUpdated!.name).toBe('Test Bank Updated')
  expect(bankUpdated!.url).toBe('updated.com')
  await sut.remove(bankId)
  const bankData = await sut.getById(bankId)
  expect(bankData).toBeFalsy()
})

test('should be able to return a bank by code', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  await connection.query(`DELETE FROM banks WHERE code = ? `, [fakeCode])
  const bankId = await sut.save({
    code: fakeCode,
    name: 'Test Bank',
    url: 'url.com',
  })
  const savedBank = await sut.getByCode(fakeCode)
  expect(savedBank).toBeTruthy()
  expect(savedBank!.bank_id).toBe(bankId)
  expect(savedBank!.code).toBe(fakeCode)
  expect(savedBank!.name).toBe('Test Bank')
  expect(savedBank!.url).toBe('url.com')
  await sut.remove(bankId)
})

test('should be able to return a bank by name', async () => {
  const fakeName = `Name ${Math.random()}`
  const bankId = await sut.save({
    code: '123',
    name: fakeName,
    url: 'url.com',
  })
  const savedBank = await sut.getByName(fakeName)
  expect(savedBank).toBeTruthy()
  expect(savedBank!.bank_id).toBe(bankId)
  expect(savedBank!.code).toBe('123')
  expect(savedBank!.name).toBe(fakeName)
  expect(savedBank!.url).toBe('url.com')
  await sut.remove(bankId)
})

test('should be able to call the query connection correctly', async () => {
  const fakeName = `Any name ${Math.random()}`
  const querySpy = Sinon.spy(connection, 'query')
  await sut.getByName(fakeName)
  expect(querySpy.calledOnce).toBeTruthy()
  expect(querySpy.calledWith(Sinon.match('name = ?'), [fakeName])).toBeTruthy()
})

test('should be able to thrown an error if bank id isnt a number on bank remove', async () => {
  await expect(sut.remove('asd' as any)).rejects.toThrow(
    new ApplicationError('Invalid bank id.'),
  )
})
