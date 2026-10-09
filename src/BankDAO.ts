import { ApplicationError } from '@ApplicationError.ts'
import mysqlConnection from 'mysql2/promise'

export interface BankDAO {
  save(dto: BankDAO.SaveDTO): Promise<number>
  list(): Promise<BankDAO.BankDTO[]>
  remove(bankId: number): Promise<void>
  getById(bankId: number): Promise<BankDAO.BankDTO | undefined>
  getByCode(code: string): Promise<BankDAO.BankDTO | undefined>
  getByName(string: string): Promise<BankDAO.BankDTO | undefined>
  update(dto: BankDAO.UpdateDTO): Promise<void>
}

export namespace BankDAO {
  export type SaveDTO = {
    code: string
    name: string
    url: string
  }

  export type UpdateDTO = {
    id: number
    code: string
    name: string
    url: string
  }

  export type BankDTO = {
    bank_id: number
    code: string
    name: string
    url: string
  }
}

export class BankDAODatabase implements BankDAO {
  async save(dto: BankDAO.SaveDTO): Promise<number> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    const [rows] = await connection.query<any[]>(
      `INSERT INTO banks(code, name, url) VALUES(?, ?, ?) RETURNING *;`,
      [dto.code, dto.name, dto.url],
    )
    const [row] = rows
    const bankId = row.bank_id
    connection.pool.end()
    return bankId
  }

  async list(): Promise<BankDAO.BankDTO[]> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    const [rows] = await connection.query<any[]>(`SELECT * FROM banks;`, [])
    connection.pool.end()
    return rows
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

  async getById(bankId: number): Promise<BankDAO.BankDTO | undefined> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    const [rows] = await connection.query<any[]>(
      `SELECT * FROM banks WHERE bank_id = ? LIMIT 1`,
      [bankId],
    )
    const [firstRow] = rows
    connection.pool.end()
    return firstRow
  }

  async getByCode(code: string): Promise<BankDAO.BankDTO | undefined> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    const [rows] = await connection.query<any[]>(
      `SELECT * FROM banks WHERE code = ? LIMIT 1`,
      [code],
    )
    const [firstRow] = rows
    connection.pool.end()
    return firstRow
  }

  async getByName(name: string): Promise<BankDAO.BankDTO | undefined> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    const [rows] = await connection.query<any[]>(
      `SELECT * FROM banks WHERE name = ? LIMIT 1`,
      [name],
    )
    const [firstRow] = rows
    connection.pool.end()
    return firstRow
  }

  async update(dto: BankDAO.UpdateDTO) {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    await connection.query(
      `UPDATE banks SET code = ?, name = ?, url = ? WHERE bank_id = ?;`,
      [dto.code, dto.name, dto.url, dto.id],
    )
    connection.pool.end()
  }
}
