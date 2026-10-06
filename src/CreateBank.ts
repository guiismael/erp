import { BankDAO } from '@BankDAO.ts'
import { UseCase } from '@UseCase.ts'

export class CreateBank implements UseCase<
  CreateBank.Input,
  CreateBank.Output
> {
  constructor(private bankDao: BankDAO) {}

  async execute(input: CreateBank.Input): Promise<CreateBank.Output> {
    const bankId = await this.bankDao.save(input)
    const output = {
      id: bankId,
      ...input,
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
