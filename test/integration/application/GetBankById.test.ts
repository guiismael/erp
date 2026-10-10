import { NotFoundError } from '@application/errors/NotFoundError.ts'
import { BankRepository } from '@application/repositories/BankRepository.ts'
import { GetBankById } from '@application/usecases/GetBankById.ts'
import { Bank } from '@domain/entities/Bank.ts'

import { BankRepositoryFake } from '../../mocks/BankRepositoryFake.ts'

let bankRepository: BankRepository
let sut: GetBankById

beforeAll(() => {
  bankRepository = new BankRepositoryFake()
  sut = new GetBankById(bankRepository)
})

test('should be able to get a bank by id', async () => {
  const bank = Bank.create({
    code: '123',
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

test('should be able to thrown an error if bank not exists', async () => {
  const bankId = 9_999_999
  const inputSut = {
    id: bankId,
  }
  await expect(sut.execute(inputSut)).rejects.toThrow(
    new NotFoundError('Bank not found.'),
  )
})
