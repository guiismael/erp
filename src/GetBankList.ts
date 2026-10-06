import { BankDAO } from '@BankDAO.ts'

export class GetBankList {
  constructor(private bankDao: BankDAO) {}

  async execute(): Promise<any> {
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
