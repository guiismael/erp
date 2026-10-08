import { Bank } from '@Bank.ts'
import { BankRepository, BankRepositoryDatabase } from '@BankRepository.ts'
import mysqlConnection from 'mysql2/promise'

let sut: BankRepository
const connection = mysqlConnection.createPool(String(process.env.DATABASE_URL))

beforeAll(() => {
  sut = new BankRepositoryDatabase()
})

afterAll(() => {
  connection.pool.end()
})

test('should be able to test bank access', async () => {
  const bank = Bank.create({
    code: '123',
    name: 'name',
    url: 'url',
  })
  const bankSaved = await sut.save(bank)
  const bankId = bankSaved.getBankId()
  const listBank = await sut.list()
  const exists = listBank.find((bank) => bank.getBankId() === bankId)
  expect(exists).toBeTruthy()
  expect(exists!.getCode()).toBe('123')
  expect(exists!.getName()).toBe('name')
  expect(exists!.getUrl()).toBe('url')
  bankSaved.setCode('321')
  bankSaved.setName('altered')
  bankSaved.setUrl('altered.com')
  await sut.update(bankSaved)
  const bankUpdated = await sut.findById(bankId)
  expect(bankUpdated).toBeTruthy()
  expect(bankUpdated!.getCode()).toBe('321')
  expect(bankUpdated!.getName()).toBe('altered')
  expect(bankUpdated!.getUrl()).toBe('altered.com')
  await sut.remove(bankId)
  const bankData = await sut.findById(bankId)
  expect(bankData).toBeFalsy()
})

test('should be able to return a bank by code', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  await connection.query(`DELETE FROM banks WHERE code = ? `, [fakeCode])
  const bank = Bank.create({
    code: fakeCode,
    name: 'name',
    url: 'url.com',
  })
  const bankSaved = await sut.save(bank)
  const bankId = bankSaved.getBankId()
  const savedBank = await sut.findByCode(fakeCode)
  expect(savedBank).toBeTruthy()
  expect(savedBank!.getBankId()).toBe(bankId)
  expect(savedBank!.getCode()).toBe(fakeCode)
  expect(savedBank!.getName()).toBe('name')
  expect(savedBank!.getUrl()).toBe('url.com')
  await sut.remove(bankId)
})

test('should be able to return a bank by name', async () => {
  const fakeName = `Name ${Math.random()}`
  const bank = Bank.create({
    code: 'AAA',
    name: fakeName,
    url: 'url.com',
  })
  const bankSaved = await sut.save(bank)
  const bankId = bankSaved.getBankId()
  const savedBank = await sut.findByName(fakeName)
  expect(savedBank).toBeTruthy()
  expect(savedBank!.getBankId()).toBe(bankId)
  expect(savedBank!.getCode()).toBe('AAA')
  expect(savedBank!.getName()).toBe(fakeName)
  expect(savedBank!.getUrl()).toBe('url.com')
  await sut.remove(bankId)
})

test('should be able to thrown an error if bank id isnt a number on bank remove', async () => {
  await expect(sut.remove('asd' as any)).rejects.toThrow('Invalid bank id.')
})
