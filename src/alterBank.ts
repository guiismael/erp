import { getById, update } from '@database.ts'

export const alterBank = async (input: any) => {
  const row = await getById(Number(input.id))
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
  await update(bankUpdated)
  return bankUpdated
}
