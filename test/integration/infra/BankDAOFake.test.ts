import { BankDAO } from '@infra/database/DAOs/BankDAO.ts'

import { BankDAOFake } from '../../mocks/BankDAOFake.ts'

let sut: BankDAO

beforeEach(() => {
  sut = new BankDAOFake()
})

test('should be able to test bank access', async () => {
  const bankId = await sut.save({
    code: '123',
    name: 'name',
    url: 'url',
  })
  const listBank = await sut.list()
  const exists = listBank.find((bankData) => bankData.bank_id === bankId)
  expect(exists).toBeTruthy()
  expect(exists?.code).toBe('123')
  expect(exists?.name).toBe('name')
  expect(exists?.url).toBe('url')
  await sut.update({
    id: bankId,
    code: '321',
    name: 'altered',
    url: 'altered',
  })
  const bankUpdated = await sut.getById(bankId)
  expect(bankUpdated).toBeTruthy()
  expect(bankUpdated?.code).toBe('321')
  expect(bankUpdated?.name).toBe('altered')
  expect(bankUpdated?.url).toBe('altered')
  await sut.remove(bankId)
  const bankData = await sut.getById(bankId)
  expect(bankData).toBeFalsy()
})

test('should be able to return a bank by code', async () => {
  const bankId = await sut.save({
    code: '123',
    name: 'Name',
    url: 'url',
  })
  const savedBank = await sut.getByCode('123')
  expect(savedBank).toBeTruthy()
  expect(savedBank!.bank_id).toBe(bankId)
  expect(savedBank!.code).toBe('123')
  expect(savedBank!.name).toBe('Name')
  expect(savedBank!.url).toBe('url')
  await sut.remove(bankId)
})

test('should be able to return a bank by name', async () => {
  const fakeName = `Name ${Math.random()}`
  const bankId = await sut.save({
    code: '123',
    name: fakeName,
    url: 'url',
  })
  const savedBank = await sut.getByName(fakeName)
  expect(savedBank).toBeTruthy()
  expect(savedBank!.bank_id).toBe(bankId)
  expect(savedBank!.code).toBe('123')
  expect(savedBank!.name).toBe(fakeName)
  expect(savedBank!.url).toBe('url')
  await sut.remove(bankId)
})

test('should be able to remove a bank by code', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const fakeName = `Name ${Math.random()}`
  await sut.save({
    code: fakeCode,
    name: fakeName,
    url: 'url.com',
  })
  await sut.removeByCode(fakeCode)
  const savedBank = await sut.getByCode(fakeCode)
  expect(savedBank).toBeFalsy()
})

test('should be able to remove a bank by name', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const fakeName = `Name ${Math.random()}`
  await sut.save({
    code: fakeCode,
    name: fakeName,
    url: 'url.com',
  })
  await sut.removeByName(fakeName)
  const savedBank = await sut.getByName(fakeName)
  expect(savedBank).toBeFalsy()
})
