import { alterBank } from '@alterBank.ts'
import { getById, list, remove, save } from '@database.ts'
import cors from 'cors'
import express, { Request, Response } from 'express'

const app = express()
app.use(express.json())
app.use(cors())

app.get('/banks', async (request: Request, response: Response) => {
  const rows = await list()
  const output = rows.map((row) => ({
    id: row.bank_id,
    code: row.code,
    name: row.name,
    url: row.url,
  }))
  response.status(200).json(output)
})

app.get('/banks/:id', async (request: Request, response: Response) => {
  const bankId = request.params.id
  const row = await getById(Number(bankId))
  if (!row) {
    response.status(404).end()
    return
  }
  const output = {
    id: row.bank_id,
    code: row.code,
    name: row.name,
    url: row.url,
  }
  response.status(200).json(output)
})

app.post('/banks', async (request: Request, response: Response) => {
  const bankData = request.body
  const bankId = await save(bankData)
  const bank = {
    id: bankId,
    ...bankData,
  }
  response.status(201).json(bank)
})

app.put('/banks/:id', async (request: Request, response: Response) => {
  const bankData = request.body
  const bankId = request.params.id
  const input = {
    id: Number(bankId),
    ...bankData,
  }
  const output = await alterBank(input)
  response.status(200).json(output)
})

app.delete('/banks/:id', async (request: Request, response: Response) => {
  const bankId = request.params.id
  await remove(Number(bankId))
  response.status(200).end()
})

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})
