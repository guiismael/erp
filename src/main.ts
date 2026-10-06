import cors from 'cors'
import express, { Request, Response } from 'express'
import mysqlConnection from 'mysql2/promise'

const app = express()
app.use(express.json())
app.use(cors())

app.get('/banks', async (request: Request, response: Response) => {
  const connection = mysqlConnection.createPool(
    String(process.env.DATABASE_URL),
  )
  const [rows] = await connection.query(`SELECT * FROM banks;`, [])
  const output = (rows as any[]).map((row) => ({
    id: row.bank_id,
    code: row.code,
    name: row.name,
    url: row.url,
  }))
  response.status(200).json(output)
  connection.pool.end()
})

app.get('/banks/:id', async (request: Request, response: Response) => {
  const connection = mysqlConnection.createPool(
    String(process.env.DATABASE_URL),
  )
  const bankId = request.params.id
  const [rows] = await connection.query(
    `SELECT * FROM banks WHERE bank_id = ? LIMIT 1`,
    [bankId],
  )
  const output = (rows as any[]).map((row) => ({
    id: row.bank_id,
    code: row.code,
    name: row.name,
    url: row.url,
  }))
  const [firstRow] = output
  if (!firstRow) {
    response.status(404).end()
    connection.pool.end()
    return
  }
  response.status(200).json(firstRow)
  connection.pool.end()
})

app.post('/banks', async (request: Request, response: Response) => {
  const bankData = request.body
  const connection = mysqlConnection.createPool(
    String(process.env.DATABASE_URL),
  )
  const [row] = await connection.query(
    `INSERT INTO banks(code, name, url) VALUES(?, ?, ?)`,
    [bankData.code, bankData.name, bankData.url],
  )
  const bankId = (row as any).insertId
  const bank = {
    id: bankId,
    ...bankData,
  }
  response.status(201).json(bank)
  connection.pool.end()
})

app.put('/banks/:id', async (request: Request, response: Response) => {
  const bankData = request.body
  const connection = mysqlConnection.createPool(
    String(process.env.DATABASE_URL),
  )
  const bankId = request.params.id
  const [rows] = await connection.query(
    `SELECT * FROM banks WHERE bank_id = ? LIMIT 1`,
    [bankId],
  )
  const output = (rows as any[]).map((row) => ({
    id: row.bank_id,
    code: row.code,
    name: row.name,
    url: row.url,
  }))
  let [firstRow] = output
  firstRow = {
    ...firstRow,
    ...bankData,
  }
  await connection.query(
    `UPDATE banks SET code = ?, name = ?, url = ? WHERE bank_id = ?`,
    [firstRow.code, firstRow.name, firstRow.url, bankId],
  )
  response.status(200).json(firstRow)
  connection.pool.end()
})

app.delete('/banks/:id', async (request: Request, response: Response) => {
  const connection = mysqlConnection.createPool(
    String(process.env.DATABASE_URL),
  )
  const bankId = request.params.id
  await connection.query(`DELETE FROM banks WHERE bank_id = ? LIMIT 1`, [
    bankId,
  ])
  response.status(200).end()
  connection.pool.end()
})

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})
