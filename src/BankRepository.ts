import { ApplicationError } from '@ApplicationError.ts'
import { Bank } from '@Bank.ts'
import mysqlConnection from 'mysql2/promise'

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
  async save(bank: Bank): Promise<Bank> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    const [rows] = await connection.query<any[]>(
      `INSERT INTO banks(code, name, url) VALUES(?, ?, ?) RETURNING *;`,
      [bank.getCode(), bank.getName(), bank.getUrl()],
    )
    const [row] = rows
    const bankId = row.bank_id
    connection.pool.end()
    const savedBank = Bank.restore({
      bankId,
      code: bank.getCode(),
      name: bank.getName(),
      url: bank.getUrl(),
    })
    return savedBank
  }

  async list(): Promise<Bank[]> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    const [rows] = await connection.query<any[]>(`SELECT * FROM banks;`, [])
    connection.pool.end()
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
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    await connection.query<any[]>(
      `DELETE FROM banks WHERE bank_id = ? LIMIT 1;`,
      [bankId],
    )
    connection.pool.end()
  }

  async findById(bankId: number): Promise<Bank | undefined> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    const [rows] = await connection.query<any[]>(
      `SELECT * FROM banks WHERE bank_id = ? LIMIT 1`,
      [bankId],
    )
    const [firstRow] = rows
    connection.pool.end()
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
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    const [rows] = await connection.query<any[]>(
      `SELECT * FROM banks WHERE code = ? LIMIT 1`,
      [code],
    )
    const [firstRow] = rows
    connection.pool.end()
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
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    const [rows] = await connection.query<any[]>(
      `SELECT * FROM banks WHERE name = ? LIMIT 1`,
      [name],
    )
    const [firstRow] = rows
    connection.pool.end()
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
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    await connection.query(
      `UPDATE banks SET code = ?, name = ?, url = ? WHERE bank_id = ?;`,
      [bank.getCode(), bank.getName(), bank.getUrl(), bank.getBankId()],
    )
    connection.pool.end()
  }
}
