import { BankDAO } from '@BankDAO.ts'
import { BankRepository } from '@BankRepository.ts'
import { CreateBank } from '@CreateBank.ts'

import { BankDAOFake } from '../../mocks/BankDAOFake.ts'
import { BankRepositoryFake } from '../../mocks/BankRepositoryFake.ts'

let bankDao: BankDAO
let bankRepository: BankRepository
let sut: CreateBank

beforeEach(() => {
  bankDao = new BankDAOFake()
  bankRepository = new BankRepositoryFake()
  sut = new CreateBank(bankRepository)
})

test('should be able to create a bank', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const inputSut = {
    code: fakeCode,
    name: `Test Name`,
    url: 'test-create.com',
  }
  const outputCreate = await sut.execute(inputSut)
  expect(outputCreate.id).toBeTruthy()
  expect(outputCreate.code).toBe(inputSut.code)
  expect(outputCreate.name).toBe(inputSut.name)
  expect(outputCreate.url).toBe(inputSut.url)
  const bank = await bankRepository.findById(outputCreate.id)
  expect(bank?.getBankId()).toBe(outputCreate.id)
  expect(bank?.getCode()).toBe(inputSut.code)
  expect(bank?.getName()).toBe(inputSut.name)
  expect(bank?.getUrl()).toBe(inputSut.url)
  await bankRepository.remove(outputCreate.id)
})

test('should not be able to create a bank with invalid name', async () => {
  const invalidName = 'abc'
  const inputCreate = {
    code: '123',
    name: invalidName,
    url: 'test-invalid.com',
  }
  await expect(sut.execute(inputCreate)).rejects.toThrow('Invalid name.')
})

test('should not be able to create a bank with invalid code', async () => {
  const invalidCode = 'ABC'
  const inputCreate = {
    code: invalidCode,
    name: 'Test Name',
    url: 'teste-code.com',
  }
  await expect(sut.execute(inputCreate)).rejects.toThrow('Invalid code.')
})

test('should not be able to create a bank with already used code', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const inputCreate = {
    code: fakeCode,
    name: 'Test Name',
    url: 'teste.com',
  }
  const { id } = await sut.execute(inputCreate)
  await expect(sut.execute(inputCreate)).rejects.toThrow(
    'A bank with this code already exists.',
  )
  await bankDao.remove(id)
})

test('should not be able to create a bank with already used name', async () => {
  const fakeName = `Name ${Math.random()}`
  const firtInput = {
    code: '123',
    name: fakeName,
    url: 'teste.com',
  }
  const { id } = await sut.execute(firtInput)
  const secondInput = {
    code: '321',
    name: fakeName,
    url: firtInput.url,
  }
  await expect(sut.execute(secondInput)).rejects.toThrow(
    'A bank with this name already exists.',
  )
  await bankDao.remove(id)
})
