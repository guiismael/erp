import { ApplicationError } from '@ApplicationError.ts'
import { BankRepository } from '@BankRepository.ts'
import { NotFoundError } from '@NotFoundError.ts'
import { UseCase } from '@UseCase.ts'

export class UpdateBank implements UseCase<
  UpdateBank.Input,
  UpdateBank.Output
> {
  constructor(private bankRepository: BankRepository) {}

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
