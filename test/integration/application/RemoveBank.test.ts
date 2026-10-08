import { Bank } from '@Bank.ts'
import { BankRepository } from '@BankRepository.ts'
import { RemoveBank } from '@RemoveBank.ts'

import { BankRepositoryFake } from '../../mocks/BankRepositoryFake.ts'

let bankRepository: BankRepository
let sut: RemoveBank

beforeAll(() => {
  bankRepository = new BankRepositoryFake()
  sut = new RemoveBank(bankRepository)
})

test('should be able to remove a bank', async () => {
  const bank = Bank.create({
    code: 'AAA',
    name: 'Any name',
    url: 'url',
  })
  const bankSaved = await bankRepository.save(bank)
  const bankId = bankSaved.getBankId()
  const inputSut = {
    id: bankId,
  }
  await sut.execute(inputSut)
  const bankExists = await bankRepository.findById(bankId)
  expect(bankExists).toBeFalsy()
})
