import { BankDAO } from '@BankDAO.ts'
import { UseCase } from '@UseCase.ts'

export class GetBankList implements UseCase<
  GetBankList.Input,
  GetBankList.Output
> {
  constructor(private bankDao: BankDAO) {}

  async execute(): Promise<GetBankList.Output> {
    const rows = await this.bankDao.list()
    const output = rows.map((row) => ({
      id: row.bank_id,
      code: row.code,
      name: row.name,
      url: row.url,
    }))
    return output
  }
}

export namespace GetBankList {
  export type Input = any

  export type Output = {
    id: number
    code: string
    name: string
    url: string
  }[]
}
