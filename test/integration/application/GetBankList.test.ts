import { Bank } from '@Bank.ts'
import { BankRepository } from '@BankRepository.ts'
import { GetBankList } from '@GetBankList.ts'

import { BankRepositoryFake } from '../../mocks/BankRepositoryFake.ts'

let bankRepository: BankRepository
let sut: GetBankList

beforeAll(() => {
  bankRepository = new BankRepositoryFake()
  sut = new GetBankList(bankRepository)
})

test('should be able to return a bank list', async () => {
  const bank = Bank.create({
    code: '123',
    name: 'Any name',
    url: 'url.com',
  })
  const bankSaved = await bankRepository.save(bank)
  const bankId = bankSaved.getBankId()
  const output = await sut.execute()
  expect(output).toBeInstanceOf(Array)
  expect(output.length).toBeGreaterThanOrEqual(1)
  const bankData = output.find((item) => item.id === bankId)
  expect(bankData).toBeTruthy()
  expect(bankData?.id).toBe(bankId)
  expect(bankData?.code).toBe(bankSaved.getCode())
  expect(bankData?.name).toBe(bankSaved.getName())
  expect(bankData?.url).toBe(bankSaved.getUrl())
  await bankRepository.remove(bankId)
})
