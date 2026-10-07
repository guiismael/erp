import { BankDAO } from '@BankDAO.ts'
import { UseCase } from '@UseCase.ts'

export class UpdateBank implements UseCase<
  UpdateBank.Input,
  UpdateBank.Output
> {
  constructor(private bankDao: BankDAO) {}

  async execute(input: UpdateBank.Input): Promise<UpdateBank.Output> {
    if (!input.name || !input.name.match(/^.+\s.+$/)) {
      throw new Error('Invalid name.')
    }
    if (
      !input.code ||
      input.code.length !== 3 ||
      input.code.replace(/\D/g, '').length !== 3
    ) {
      throw new Error('Invalid code.')
    }
    const row = await this.bankDao.getById(input.id)
    const output = {
      id: row?.bank_id,
      code: row?.code,
      name: row?.name,
      url: row?.url,
    }
    const bankUpdated = {
      ...output,
      ...input,
    }
    await this.bankDao.update(bankUpdated)
    return bankUpdated
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
