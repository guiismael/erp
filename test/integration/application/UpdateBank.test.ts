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
