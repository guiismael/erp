import { ApplicationError } from '@ApplicationError.ts'
import { Bank } from '@Bank.ts'
import { DatabaseConnection } from '@DatabaseConnection.ts'

export interface BankRepository {
  save(bank: Bank): Promise<Bank>
  list(): Promise<Bank[]>
  remove(bankId: number): Promise<void>
  findById(bankId: number): Promise<Bank | undefined>
  findByCode(code: string): Promise<Bank | undefined>
  findByName(name: string): Promise<Bank | undefined>
  update(bank: Bank): Promise<void>
}

export class BankRepositoryDatabase implements BankRepository {
  constructor(private connection: DatabaseConnection) {}

  async save(bank: Bank): Promise<Bank> {
    const [row] = await this.connection.query(
      `INSERT INTO banks(code, name, url) VALUES(?, ?, ?) RETURNING *;`,
      [bank.getCode(), bank.getName(), bank.getUrl()],
    )
    const bankId = row.bank_id
    const savedBank = Bank.restore({
      bankId,
      code: bank.getCode(),
      name: bank.getName(),
      url: bank.getUrl(),
    })
    return savedBank
  }

  async list(): Promise<Bank[]> {
    const rows = await this.connection.query(`SELECT * FROM banks;`, [])
    const bankList: Bank[] = []
    for (const row of rows) {
      const bank = Bank.restore({
        bankId: row.bank_id,
        code: row.code,
        name: row.name,
        url: row.url,
      })
      bankList.push(bank)
    }
    return bankList
  }

  async remove(bankId: number) {
    if (isNaN(bankId)) throw new ApplicationError('Invalid bank id.')
    await this.connection.query(
      `DELETE FROM banks WHERE bank_id = ? LIMIT 1;`,
      [bankId],
    )
  }

  async findById(bankId: number): Promise<Bank | undefined> {
    const [firstRow] = await this.connection.query(
      `SELECT * FROM banks WHERE bank_id = ? LIMIT 1`,
      [bankId],
    )
    if (!firstRow) return
    const bank = Bank.restore({
      bankId: firstRow.bank_id,
      code: firstRow.code,
      name: firstRow.name,
      url: firstRow.url,
    })
    return bank
  }

  async findByCode(code: string): Promise<Bank | undefined> {
    const [firstRow] = await this.connection.query(
      `SELECT * FROM banks WHERE code = ? LIMIT 1`,
      [code],
    )
    if (!firstRow) return
    const bank = Bank.restore({
      bankId: firstRow.bank_id,
      code: firstRow.code,
      name: firstRow.name,
      url: firstRow.url,
    })
    return bank
  }

  async findByName(name: string): Promise<Bank | undefined> {
    const [firstRow] = await this.connection.query(
      `SELECT * FROM banks WHERE name = ? LIMIT 1`,
      [name],
    )
    if (!firstRow) return
    const bank = Bank.restore({
      bankId: firstRow.bank_id,
      code: firstRow.code,
      name: firstRow.name,
      url: firstRow.url,
    })
    return bank
  }

  async update(bank: Bank) {
    await this.connection.query(
      `UPDATE banks SET code = ?, name = ?, url = ? WHERE bank_id = ?;`,
      [bank.getCode(), bank.getName(), bank.getUrl(), bank.getBankId()],
    )
  }
}
