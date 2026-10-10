import { ApplicationError } from '@application/errors/ApplicationError.ts'
import { BankRepository } from '@application/repositories/BankRepository.ts'
import { Bank } from '@domain/entities/Bank.ts'

import { UseCase } from './UseCase.ts'

export class CreateBank implements UseCase<
  CreateBank.Input,
  CreateBank.Output
> {
  constructor(private bankRepository: BankRepository) {}

  async execute(input: CreateBank.Input): Promise<CreateBank.Output> {
    const bank = Bank.create({
      code: input.code,
      name: input.name,
      url: input.url,
    })
    const alreadyExistsWithCode = await this.bankRepository.findByCode(
      input.code,
    )
    if (alreadyExistsWithCode)
      throw new ApplicationError('A bank with this code already exists.')
    const alreadyExistsWithName = await this.bankRepository.findByName(
      input.name,
    )
    if (alreadyExistsWithName)
      throw new ApplicationError('A bank with this name already exists.')
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
