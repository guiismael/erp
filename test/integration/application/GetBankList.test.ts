import { BankDAO } from '@BankDAO.ts'
import { GetBankList } from '@GetBankList.ts'

import { BankDAOFake } from '../../mocks/BankDAOFake.ts'

let bankDao: BankDAO
let sut: GetBankList

beforeAll(() => {
  bankDao = new BankDAOFake()
  sut = new GetBankList(bankDao)
})

test('should be able to return a bank list', async () => {
  const inputCreate = {
    code: '559',
    name: `Test List`,
    url: 'test-list.com',
  }
  const bankId = await bankDao.save(inputCreate)
  const output = await sut.execute()
  expect(output).toBeInstanceOf(Array)
  expect(output.length).toBeGreaterThanOrEqual(1)
  const bankData = output.find((item) => item.id === bankId)
  expect(bankData).toBeTruthy()
  expect(bankData?.id).toBe(bankId)
  expect(bankData?.code).toBe(inputCreate.code)
  expect(bankData?.name).toBe(inputCreate.name)
  expect(bankData?.url).toBe(inputCreate.url)
  await bankDao.remove(bankId)
})
