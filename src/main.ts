import { BankDAO } from '@BankDAO.ts'
import { UpdateBank } from '@UpdateBank.ts'
import cors from 'cors'
import express, { Request, Response } from 'express'

const app = express()
app.use(express.json())
app.use(cors())

const bankDao = new BankDAO()

app.get('/banks', async (request: Request, response: Response) => {
  const rows = await bankDao.list()
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
  const row = await bankDao.getById(Number(bankId))
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
  const bankId = await bankDao.save(bankData)
  const bank = {
    id: bankId,
    ...bankData,
  }
  response.status(201).json(bank)
})

app.put('/banks/:id', async (request: Request, response: Response) => {
  const bankData = request.body
  const bankId = request.params.id
  const usecase = new UpdateBank(bankDao)
  const input = {
    id: Number(bankId),
    ...bankData,
  }
  const output = await usecase.execute(input)
  response.status(200).json(output)
})

app.delete('/banks/:id', async (request: Request, response: Response) => {
  const bankId = request.params.id
  await bankDao.remove(Number(bankId))
  response.status(200).end()
})

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})
