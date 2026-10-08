import { Bank } from '@Bank.ts'
import { BankRepository } from '@BankRepository.ts'
import { GetBankById } from '@GetBankById.ts'

import { BankRepositoryFake } from '../../mocks/BankRepositoryFake.ts'

let bankRepository: BankRepository
let sut: GetBankById

beforeAll(() => {
  bankRepository = new BankRepositoryFake()
  sut = new GetBankById(bankRepository)
})

test('should be able to get a bank by id', async () => {
  const bank = Bank.create({
    code: 'AAA',
    name: `Any name`,
    url: 'url.com',
  })
  const bankSaved = await bankRepository.save(bank)
  const bankId = bankSaved.getBankId()
  const inputSut = {
    id: bankId,
  }
  const output = await sut.execute(inputSut)
  expect(output?.id).toBe(bankId)
  expect(output?.code).toBe(bankSaved.getCode())
  expect(output?.name).toBe(bankSaved.getName())
  expect(output?.url).toBe(bankSaved.getUrl())
  await bankRepository.remove(bankId)
})
