import mysqlConnection from 'mysql2/promise'

export const save = async (dto: any) => {
  const connection = mysqlConnection.createPool(
    String(process.env.DATABASE_URL),
  )
  const [row] = await connection.query(
    `INSERT INTO banks(code, name, url) VALUES(?, ?, ?);`,
    [dto.code, dto.name, dto.url],
  )
  const bankId = (row as any).insertId
  connection.pool.end()
  return bankId
}

export const list = async () => {
  const connection = mysqlConnection.createPool(
    String(process.env.DATABASE_URL),
  )
  const [rows] = await connection.query<any[]>(`SELECT * FROM banks;`, [])
  connection.pool.end()
  return rows
}

export const remove = async (bankId: number) => {
  const connection = mysqlConnection.createPool(
    String(process.env.DATABASE_URL),
  )
  await connection.query<any[]>(
    `DELETE FROM banks WHERE bank_id = ? LIMIT 1;`,
    [bankId],
  )
  connection.pool.end()
}

export const getById = async (bankId: number) => {
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

export const update = async (dto: any) => {
  const connection = mysqlConnection.createPool(
    String(process.env.DATABASE_URL),
  )
  await connection.query(
    `UPDATE banks SET code = ?, name = ?, url = ? WHERE bank_id = ?;`,
    [dto.code, dto.name, dto.url, dto.id],
  )
  connection.pool.end()
}
