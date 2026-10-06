import { BankDAO } from '@BankDAO.ts'
import { UseCase } from '@UseCase.ts'

export class GetBankById implements UseCase<
  GetBankById.Input,
  GetBankById.Output
> {
  constructor(private bankDao: BankDAO) {}

  async execute(input: GetBankById.Input): Promise<GetBankById.Output> {
    const row = await this.bankDao.getById(input.id)
    if (!row) {
      return undefined
    }
    const output = {
      id: row.bank_id,
      code: row.code,
      name: row.name,
      url: row.url,
    }
    return output
  }
}

export namespace GetBankById {
  export type Input = {
    id: number
  }

  export type Output =
    | {
        id: number
        code: string
        name: string
        url: string
      }
    | undefined
}
