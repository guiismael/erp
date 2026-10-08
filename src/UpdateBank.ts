import { BankRepository } from '@BankRepository.ts'
import { UseCase } from '@UseCase.ts'
import { validateBankCode } from '@validateBankCode.ts'
import { validateBankName } from '@validateBankName.ts'

export class UpdateBank implements UseCase<
  UpdateBank.Input,
  UpdateBank.Output
> {
  constructor(private bankRepository: BankRepository) {}

  async execute(input: UpdateBank.Input): Promise<UpdateBank.Output> {
    if (!validateBankName(input.name)) throw new Error('Invalid name.')
    if (!validateBankCode(input.code)) throw new Error('Invalid code.')
    const bank = await this.bankRepository.findById(input.id)
    if (!bank) throw new Error('Bank not found.')
    if (bank.getCode() !== input.code) {
      const alreadyExistsWithCode = await this.bankRepository.findByCode(
        input.code,
      )
      if (alreadyExistsWithCode)
        throw new Error('Code already registered by other bank.')
      bank.changeCode(input.code)
    }
    if (bank.getName() !== input.name) {
      const alreadyExistsWithCode = await this.bankRepository.findByName(
        input.name,
      )
      if (alreadyExistsWithCode)
        throw new Error('Name already registered by other bank')
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
