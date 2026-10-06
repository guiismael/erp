import { BankDAO } from '@BankDAO.ts'

export class UpdateBank {
  constructor(private bankDao: BankDAO) {}

  async execute(input: any) {
    const row = await this.bankDao.getById(Number(input.id))
    const output = {
      id: row.bank_id,
      code: row.code,
      name: row.name,
      url: row.url,
    }
    const bankUpdated = {
      ...output,
      ...input,
    }
    await this.bankDao.update(bankUpdated)
    return bankUpdated
  }
}
