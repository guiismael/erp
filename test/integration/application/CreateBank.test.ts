import { BankDAO } from '@BankDAO.ts'
import { CreateBank } from '@CreateBank.ts'
import { GetBankById } from '@GetBankById.ts'

import { BankDAOFake } from '../../mocks/BankDAOFake.ts'

let bankDao: BankDAO
let getBankByIdUseCase: GetBankById
let sut: CreateBank

beforeAll(() => {
  bankDao = new BankDAOFake()
  getBankByIdUseCase = new GetBankById(bankDao)
  sut = new CreateBank(bankDao)
})

test('should be able to create a bank', async () => {
  const inputSut = {
    code: '555',
    name: `Test Name`,
    url: 'test-create.com',
  }
  const outputCreate = await sut.execute(inputSut)
  expect(outputCreate.id).toBeTruthy()
  expect(outputCreate.code).toBe(inputSut.code)
  expect(outputCreate.name).toBe(inputSut.name)
  expect(outputCreate.url).toBe(inputSut.url)
  const inputGet = {
    id: outputCreate.id,
  }
  const outputGet = await getBankByIdUseCase.execute(inputGet)
  expect(outputGet.id).toBe(outputCreate.id)
  expect(outputGet.code).toBe(inputSut.code)
  expect(outputGet.name).toBe(inputSut.name)
  expect(outputGet.url).toBe(inputSut.url)
  await bankDao.remove(outputCreate.id)
})
