import { ApplicationError } from '@ApplicationError.ts'
import { Bank } from '@Bank.ts'
import { BankRepository } from '@BankRepository.ts'
import { UpdateBank } from '@UpdateBank.ts'

import { BankRepositoryFake } from '../../mocks/BankRepositoryFake.ts'

let bankRepository: BankRepository
let sut: UpdateBank

beforeAll(() => {
  bankRepository = new BankRepositoryFake()
  sut = new UpdateBank(bankRepository)
})

test('should be able to alter a bank data', async () => {
  const bank = Bank.create({
    code: '123',
    name: 'Any name',
    url: 'url.com',
  })
  const bankSaved = await bankRepository.save(bank)
  const bankId = bankSaved.getBankId()
  const inputUpdate = {
    id: bankId,
    code: '321',
    name: 'Test Name Changed',
    url: 'teste.changed.com',
  }
  const outputUpdate = await sut.execute(inputUpdate)
  expect(outputUpdate.id).toBe(bankId)
  expect(outputUpdate.code).toBe(inputUpdate.code)
  expect(outputUpdate.name).toBe(inputUpdate.name)
  expect(outputUpdate.url).toBe(inputUpdate.url)
  const bankUpdated = await bankRepository.findById(bankId)
  expect(bankUpdated).toBeTruthy()
  expect(bankUpdated?.getBankId()).toBe(bankId)
  expect(bankUpdated?.getCode()).toBe(inputUpdate.code)
  expect(bankUpdated?.getName()).toBe(inputUpdate.name)
  expect(bankUpdated?.getUrl()).toBe(inputUpdate.url)
  await bankRepository.remove(bankId)
})

test('should not be able to update a bank with invalid name', async () => {
  const bank = Bank.create({
    code: '123',
    name: 'Any name',
    url: 'url.com',
  })
  const bankSaved = await bankRepository.save(bank)
  const bankId = bankSaved.getBankId()
  const invalidName = 'abc'
  const inputUpdate = {
    id: bankId,
    code: '123',
    name: invalidName,
    url: 'test.changed.com',
  }
  await expect(sut.execute(inputUpdate)).rejects.toThrow('Invalid name.')
  await bankRepository.remove(bankId)
})

test('should not be able to update a bank with invalid code', async () => {
  const bank = Bank.create({
    code: '123',
    name: 'Any name',
    url: 'url.com',
  })
  const bankSaved = await bankRepository.save(bank)
  const bankId = bankSaved.getBankId()
  const invalidCode = 'ABC'
  const inputUpdate = {
    id: bankId,
    code: invalidCode,
    name: 'Test Code',
    url: 'test.changed.com',
  }
  await expect(sut.execute(inputUpdate)).rejects.toThrow('Invalid code.')
  await bankRepository.remove(bankId)
})

test('should not be able to update an inexistent bank', async () => {
  const inputUpdate = {
    id: 9_999_999,
    code: '999',
    name: 'Inexistent Bank',
    url: 'update.inexistent.com',
  }
  await expect(sut.execute(inputUpdate)).rejects.toThrow('Bank not found.')
})

test('should not be able to update a bank with code used by other bank', async () => {
  const firstBank = Bank.create({
    code: '123',
    name: 'Test Name',
    url: 'url.com',
  })
  const firstBankSaved = await bankRepository.save(firstBank)
  const firstBankId = firstBankSaved.getBankId()
  const secondBank = Bank.create({
    code: '234',
    name: 'Test Name',
    url: 'url.com',
  })
  const secondBankSaved = await bankRepository.save(secondBank)
  const secondBankId = secondBankSaved.getBankId()
  const inputUpdate = {
    id: firstBankId,
    code: '234',
    name: 'Test Name Changed',
    url: 'teste4.changed.com',
  }
  await expect(sut.execute(inputUpdate)).rejects.toThrow(
    new ApplicationError('Code already registered by other bank.'),
  )

  await bankRepository.remove(firstBankId)
  await bankRepository.remove(secondBankId)
})

test('should not be able to update a bank with name used by other bank', async () => {
  const firstBank = Bank.create({
    code: '123',
    name: 'Test Name',
    url: 'teste.com',
  })
  const firstBankSaved = await bankRepository.save(firstBank)
  const firstBankId = firstBankSaved.getBankId()
  const secondBank = Bank.create({
    code: '123',
    name: 'Test Name Changed',
    url: 'teste.com',
  })
  const secondBankSaved = await bankRepository.save(secondBank)
  const secondBankId = secondBankSaved.getBankId()
  const inputUpdate = {
    id: firstBankId,
    code: firstBankSaved.getCode(),
    name: secondBankSaved.getName(),
    url: 'teste.changed.com',
  }
  await expect(sut.execute(inputUpdate)).rejects.toThrow(
    new ApplicationError('Name already registered by other bank.'),
  )

  await bankRepository.remove(firstBankId)
  await bankRepository.remove(secondBankId)
})
