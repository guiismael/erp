import { BankDAO } from '@BankDAO.ts'
import { RemoveBank } from '@RemoveBank.ts'

import { BankDAOFake } from '../../mocks/BankDAOFake.ts'

let bankDao: BankDAO
let sut: RemoveBank

beforeAll(() => {
  bankDao = new BankDAOFake()
  sut = new RemoveBank(bankDao)
})

test('should be able to remove a bank', async () => {
  const inputCreate = {
    code: '551',
    name: `Test Remove`,
    url: 'test-remove.com',
  }
  const bankId = await bankDao.save(inputCreate)
  const inputSut = {
    id: bankId,
  }
  await sut.execute(inputSut)
  const bankExists = await bankDao.getById(bankId)
  expect(bankExists).toBeFalsy()
})
