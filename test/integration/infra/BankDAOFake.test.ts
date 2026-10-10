import { BankDAO } from '@infra/database/DAOs/BankDAO.ts'

import { BankDAOFake } from '../../mocks/BankDAOFake.ts'

let bankDao: BankDAO

beforeEach(() => {
  bankDao = new BankDAOFake()
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
  expect(exists?.code).toBe('123')
  expect(exists?.name).toBe('name')
  expect(exists?.url).toBe('url')
  await bankDao.update({
    id: bankId,
    code: '321',
    name: 'altered',
    url: 'altered',
  })
  const bankUpdated = await bankDao.getById(bankId)
  expect(bankUpdated).toBeTruthy()
  expect(bankUpdated?.code).toBe('321')
  expect(bankUpdated?.name).toBe('altered')
  expect(bankUpdated?.url).toBe('altered')
  await bankDao.remove(bankId)
  const bankData = await bankDao.getById(bankId)
  expect(bankData).toBeFalsy()
})

test('should be able to return a bank by code', async () => {
  const bankId = await bankDao.save({
    code: '123',
    name: 'Name',
    url: 'url',
  })
  const savedBank = await bankDao.getByCode('123')
  expect(savedBank).toBeTruthy()
  expect(savedBank!.bank_id).toBe(bankId)
  expect(savedBank!.code).toBe('123')
  expect(savedBank!.name).toBe('Name')
  expect(savedBank!.url).toBe('url')
  await bankDao.remove(bankId)
})

test('should be able to return a bank by name', async () => {
  const fakeName = `Name ${Math.random()}`
  const bankId = await bankDao.save({
    code: '123',
    name: fakeName,
    url: 'url',
  })
  const savedBank = await bankDao.getByName(fakeName)
  expect(savedBank).toBeTruthy()
  expect(savedBank!.bank_id).toBe(bankId)
  expect(savedBank!.code).toBe('123')
  expect(savedBank!.name).toBe(fakeName)
  expect(savedBank!.url).toBe('url')
  await bankDao.remove(bankId)
})
