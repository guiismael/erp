import { ApplicationError } from '@ApplicationError.ts'
import { BankDAO } from '@BankDAO.ts'
import { DatabaseConnection } from '@DatabaseConnection.ts'

export class BankDAOSQL implements BankDAO {
  constructor(private connection: DatabaseConnection) {}

  async save(dto: BankDAO.SaveDTO): Promise<number> {
    const [row] = await this.connection.query(
      `INSERT INTO banks(code, name, url) VALUES(?, ?, ?) RETURNING *;`,
      [dto.code, dto.name, dto.url],
    )
    const bankId = row.bank_id
    return bankId
  }

  async list(): Promise<BankDAO.BankDTO[]> {
    const rows = await this.connection.query(`SELECT * FROM banks;`, [])

    return rows.map((row) => ({
      bank_id: row.bank_id,
      code: row.code,
      name: row.name,
      url: row.url,
    }))
  }

  async remove(bankId: number) {
    if (isNaN(bankId)) throw new ApplicationError('Invalid bank id.')
    await this.connection.query(`DELETE FROM banks WHERE bank_id = ?;`, [
      bankId,
    ])
  }

  async getById(bankId: number): Promise<BankDAO.BankDTO | undefined> {
    const [firstRow] = await this.connection.query(
      `SELECT * FROM banks WHERE bank_id = ?;`,
      [bankId],
    )
    if (!firstRow) return
    return {
      bank_id: firstRow.bank_id,
      code: firstRow.code,
      name: firstRow.name,
      url: firstRow.url,
    }
  }

  async getByCode(code: string): Promise<BankDAO.BankDTO | undefined> {
    const [firstRow] = await this.connection.query(
      `SELECT * FROM banks WHERE code = ?;`,
      [code],
    )
    if (!firstRow) return
    return {
      bank_id: firstRow.bank_id,
      code: firstRow.code,
      name: firstRow.name,
      url: firstRow.url,
    }
  }

  async getByName(name: string): Promise<BankDAO.BankDTO | undefined> {
    const [firstRow] = await this.connection.query(
      `SELECT * FROM banks WHERE name = ?;`,
      [name],
    )
    if (!firstRow) return
    return {
      bank_id: firstRow.bank_id,
      code: firstRow.code,
      name: firstRow.name,
      url: firstRow.url,
    }
  }

  async update(dto: BankDAO.UpdateDTO) {
    await this.connection.query(
      `UPDATE banks SET code = ?, name = ?, url = ? WHERE bank_id = ?;`,
      [dto.code, dto.name, dto.url, dto.id],
    )
  }
}
