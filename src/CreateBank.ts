import { Bank } from '@Bank.ts'
import { BankRepository } from '@BankRepository.ts'
import { UseCase } from '@UseCase.ts'
import { validateBankCode } from '@validateBankCode.ts'
import { validateBankName } from '@validateBankName.ts'

export class CreateBank implements UseCase<
  CreateBank.Input,
  CreateBank.Output
> {
  constructor(private bankRepository: BankRepository) {}

  async execute(input: CreateBank.Input): Promise<CreateBank.Output> {
    if (!validateBankName(input.name)) throw new Error('Invalid name.')
    if (!validateBankCode(input.code)) throw new Error('Invalid code.')
    const alreadyExistsWithCode = await this.bankRepository.findByCode(
      input.code,
    )
    if (alreadyExistsWithCode)
      throw new Error('A bank with this code already exists.')
    const alreadyExistsWithName = await this.bankRepository.findByName(
      input.name,
    )
    if (alreadyExistsWithName)
      throw new Error('A bank with this name already exists.')
    const bank = Bank.create({
      code: input.code,
      name: input.name,
      url: input.url,
    })
    const savedBank = await this.bankRepository.save(bank)
    const output = {
      id: savedBank.getBankId(),
      code: savedBank.getCode(),
      name: savedBank.getName(),
      url: savedBank.getUrl(),
    }
    return output
  }
}

export namespace CreateBank {
  export type Input = {
    code: string
    name: string
    url: string
  }

  export type Output = {
    id: number
    code: string
    name: string
    url: string
  }
}
