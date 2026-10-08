import { Bank } from '@Bank.ts'
import { BankRepository } from '@BankRepository.ts'

import { BankRepositoryFake } from '../../mocks/BankRepositoryFake.ts'

let sut: BankRepository

beforeEach(() => {
  sut = new BankRepositoryFake()
})

test('should be able to test bank access', async () => {
  const bank = Bank.create({
    code: '123',
    name: 'Test Bank',
    url: 'url.com',
  })
  const bankSaved = await sut.save(bank)
  const listBank = await sut.list()
  const exists = listBank.find(
    (bank) => bank.getBankId() === bankSaved.getBankId(),
  )
  expect(exists).toBeTruthy()
  expect(exists?.getCode()).toBe('123')
  expect(exists?.getName()).toBe('Test Bank')
  expect(exists?.getUrl()).toBe('url.com')
  bankSaved.changeCode('321')
  bankSaved.changeName('Test Bank Updated')
  bankSaved.setUrl('updated.com')
  await sut.update(bankSaved)
  const bankUpdated = await sut.findById(bankSaved.getBankId())
  expect(bankUpdated).toBeTruthy()
  expect(bankUpdated?.getCode()).toBe('321')
  expect(bankUpdated?.getName()).toBe('Test Bank Updated')
  expect(bankUpdated?.getUrl()).toBe('updated.com')
  await sut.remove(bankSaved.getBankId())
  const bankData = await sut.findById(bankSaved.getBankId())
  expect(bankData).toBeFalsy()
})

test('should be able to return a bank by code', async () => {
  const bank = Bank.create({
    code: '123',
    name: 'Test Bank',
    url: 'url.com',
  })
  const bankSaved = await sut.save(bank)
  const savedBank = await sut.findByCode('123')
  expect(savedBank).toBeTruthy()
  expect(savedBank!.getBankId()).toBe(bankSaved.getBankId())
  expect(savedBank!.getCode()).toBe('123')
  expect(savedBank!.getName()).toBe('Test Bank')
  expect(savedBank!.getUrl()).toBe('url.com')
  await sut.remove(bankSaved.getBankId())
})

test('should be able to return a bank by name', async () => {
  const fakeName = `Name ${Math.random()}`
  const bank = Bank.create({
    code: '123',
    name: fakeName,
    url: 'url.com',
  })
  const bankSaved = await sut.save(bank)
  const savedBank = await sut.findByName(fakeName)
  expect(savedBank).toBeTruthy()
  expect(savedBank!.getBankId()).toBe(bankSaved.getBankId())
  expect(savedBank!.getCode()).toBe('123')
  expect(savedBank!.getName()).toBe(fakeName)
  expect(savedBank!.getUrl()).toBe('url.com')
  await sut.remove(bankSaved.getBankId())
})
