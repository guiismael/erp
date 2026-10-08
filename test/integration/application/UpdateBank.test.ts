import { BankDAO } from '@BankDAO.ts'
import { UpdateBank } from '@UpdateBank.ts'

import { BankDAOFake } from '../../mocks/BankDAOFake.ts'

let bankDao: BankDAO
let sut: UpdateBank

beforeAll(() => {
  bankDao = new BankDAOFake()
  sut = new UpdateBank(bankDao)
})

test('should be able to alter a bank data', async () => {
  const inputCreate = {
    code: '553',
    name: `Test Name`,
    url: 'teste4.com',
  }
  const bankId = await bankDao.save(inputCreate)
  const inputUpdate = {
    id: bankId,
    code: '553',
    name: 'Test Name Changed',
    url: 'teste4.changed.com',
  }
  const outputUpdate = await sut.execute(inputUpdate)
  expect(outputUpdate.id).toBe(bankId)
  expect(outputUpdate.code).toBe(inputUpdate.code)
  expect(outputUpdate.name).toBe(inputUpdate.name)
  expect(outputUpdate.url).toBe(inputUpdate.url)
  const outputGet = await bankDao.getById(bankId)
  expect(outputGet).toBeTruthy()
  expect(outputGet?.bank_id).toBe(bankId)
  expect(outputGet?.code).toBe(inputUpdate.code)
  expect(outputGet?.name).toBe(inputUpdate.name)
  expect(outputGet?.url).toBe(inputUpdate.url)
  await bankDao.remove(bankId)
})

test.each([null, undefined, '', 'Test'])(
  'should not be able to update a bank with invalid name %s',
  async (invalidName: any) => {
    const inputCreate = {
      code: '555',
      name: invalidName,
      url: 'test-invalid.com',
    }
    const bankId = await bankDao.save(inputCreate)
    const inputUpdate = {
      id: bankId,
      code: '555',
      name: invalidName,
      url: 'test.changed.com',
    }
    await expect(sut.execute(inputUpdate)).rejects.toThrow('Invalid name.')
    await bankDao.remove(bankId)
  },
)

test.each(['', undefined, null, 'Test', '1', '01', 'ABC'])(
  'should not be able to update a bank with invalid code %s',
  async (invalidCode: any) => {
    const inputCreate = {
      code: invalidCode,
      name: 'Test Code',
      url: 'test-invalid.com',
    }
    const bankId = await bankDao.save(inputCreate)
    const inputUpdate = {
      id: bankId,
      code: invalidCode,
      name: 'Test Code',
      url: 'test.changed.com',
    }
    await expect(sut.execute(inputUpdate)).rejects.toThrow('Invalid code.')
    await bankDao.remove(bankId)
  },
)

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
  const firstInputCreate = {
    code: '553',
    name: 'Test Name',
    url: 'teste4.com',
  }
  const firstBankId = await bankDao.save(firstInputCreate)
  const secondInputCreate = {
    code: '554',
    name: 'Test Name',
    url: 'teste4.com',
  }
  const secondBankId = await bankDao.save(secondInputCreate)
  const inputUpdate = {
    id: firstBankId,
    code: '554',
    name: 'Test Name Changed',
    url: 'teste4.changed.com',
  }
  await expect(sut.execute(inputUpdate)).rejects.toThrow(
    'Code already registered by other bank',
  )

  await bankDao.remove(firstBankId)
  await bankDao.remove(secondBankId)
})

test('should not be able to update a bank with name used by other bank', async () => {
  const firstInputCreate = {
    code: '553',
    name: 'Test Name',
    url: 'teste.com',
  }
  const firstBankId = await bankDao.save(firstInputCreate)
  const secondInputCreate = {
    code: '553',
    name: 'Test Name Changed',
    url: 'teste.com',
  }
  const secondBankId = await bankDao.save(secondInputCreate)
  const inputUpdate = {
    id: firstBankId,
    code: firstInputCreate.code,
    name: secondInputCreate.name,
    url: 'teste.changed.com',
  }
  await expect(sut.execute(inputUpdate)).rejects.toThrow(
    'Name already registered by other bank',
  )

  await bankDao.remove(firstBankId)
  await bankDao.remove(secondBankId)
})
