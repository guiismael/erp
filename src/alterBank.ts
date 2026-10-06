import { BankDAO } from '@BankDAO.ts'

export const alterBank = async (input: any) => {
  const bankDao = new BankDAO()
  const row = await bankDao.getById(Number(input.id))
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
  await bankDao.update(bankUpdated)
  return bankUpdated
}
