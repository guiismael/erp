import { BankDAO } from '@BankDAO.ts'
import { GetBankById } from '@GetBankById.ts'

import { BankDAOFake } from '../../mocks/BankDAOFake.ts'

let bankDao: BankDAO
let sut: GetBankById

beforeAll(() => {
  bankDao = new BankDAOFake()
  sut = new GetBankById(bankDao)
})

test('should be able to get a bank by id', async () => {
  const inputCreate = {
    code: '559',
    name: `Test Get One`,
    url: 'test-one.com',
  }
  const bankId = await bankDao.save(inputCreate)
  const inputSut = {
    id: bankId,
  }
  const output = await sut.execute(inputSut)
  expect(output?.id).toBe(bankId)
  expect(output?.code).toBe(inputCreate.code)
  expect(output?.name).toBe(inputCreate.name)
  expect(output?.url).toBe(inputCreate.url)
  await bankDao.remove(bankId)
})
