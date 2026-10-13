import { ApplicationError } from '@application/errors/ApplicationError.ts'
import { NotFoundError } from '@application/errors/NotFoundError.ts'
import { EventPublisher } from '@application/EventPublisher.ts'
import { BankRepository } from '@application/repositories/BankRepository.ts'

import { UseCase } from './UseCase.ts'

export class UpdateBank implements UseCase<
  UpdateBank.Input,
  UpdateBank.Output
> {
  constructor(
    private bankRepository: BankRepository,
    private eventPublisher: EventPublisher,
  ) {}

  async execute(input: UpdateBank.Input): Promise<UpdateBank.Output> {
    const bank = await this.bankRepository.findById(input.id)
    if (!bank) throw new NotFoundError('Bank not found.')
    if (bank.getCode() !== input.code) {
      const alreadyExistsWithCode = await this.bankRepository.findByCode(
        input.code,
      )
      if (alreadyExistsWithCode)
        throw new ApplicationError('Code already registered by other bank.')
      bank.changeCode(input.code)
    }
    if (bank.getName() !== input.name) {
      const alreadyExistsWithCode = await this.bankRepository.findByName(
        input.name,
      )
      if (alreadyExistsWithCode)
        throw new ApplicationError('Name already registered by other bank.')
      bank.changeName(input.name)
    }
    bank.setUrl(input.url)
    await this.bankRepository.update(bank)
    const bankEvents = bank.getDomainEvents()
    await this.eventPublisher.publishAll(bankEvents)
    return {
      id: bank.getBankId(),
      code: bank.getCode(),
      name: bank.getName(),
      url: bank.getUrl(),
    }
  }
}

export namespace UpdateBank {
  export type Input = {
    id: number
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
