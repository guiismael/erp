import { ApplicationError } from '@ApplicationError.ts'
import { BankRepositoryDatabase } from '@BankRepository.ts'
import { CreateBank } from '@CreateBank.ts'
import { DomainError } from '@DomainError.ts'
import { GetBankById } from '@GetBankById.ts'
import { GetBankList } from '@GetBankList.ts'
import { NotFoundError } from '@NotFoundError.ts'
import { RemoveBank } from '@RemoveBank.ts'
import { UpdateBank } from '@UpdateBank.ts'
import cors from 'cors'
import express, { Request, Response } from 'express'

const app = express()
app.use(express.json())
app.use(cors())

const bankRepository = new BankRepositoryDatabase()

app.get('/banks', async (request: Request, response: Response) => {
  const usecase = new GetBankList(bankRepository)
  try {
    const output = await usecase.execute()
    return response.status(200).json(output)
  } catch (error: any) {
    return response.status(500).json({
      code: 'SERVER_ERROR',
      message: 'Internal server error.',
    })
  }
})

app.get('/banks/:id', async (request: Request, response: Response) => {
  const bankId = Number(request.params.id)
  const usecase = new GetBankById(bankRepository)
  const input = {
    id: bankId,
  }
  try {
    const output = await usecase.execute(input)
    return response.status(200).json(output)
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return response.status(404).json({
        code: error.code,
        message: error.message,
      })
    }
    return response.status(500).json({
      code: 'SERVER_ERROR',
      message: 'Internal server error.',
    })
  }
})

app.post('/banks', async (request: Request, response: Response) => {
  const input = request.body
  const usecase = new CreateBank(bankRepository)
  try {
    const output = await usecase.execute(input)
    return response.status(201).json(output)
  } catch (error: any) {
    if (error instanceof DomainError) {
      return response.status(422).json({
        code: error.code,
        message: error.message,
      })
    }
    return response.status(500).json({
      code: 'SERVER_ERROR',
      message: 'Internal server error.',
    })
  }
})

app.put('/banks/:id', async (request: Request, response: Response) => {
  const bankData = request.body
  const bankId = request.params.id
  const usecase = new UpdateBank(bankRepository)
  const input = {
    id: Number(bankId),
    ...bankData,
  }
  try {
    const output = await usecase.execute(input)
    return response.status(200).json(output)
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return response.status(404).json({
        code: error.code,
        message: error.message,
      })
    }
    if (error instanceof DomainError) {
      return response.status(422).json({
        code: error.code,
        message: error.message,
      })
    }
    return response.status(500).json({
      code: 'SERVER_ERROR',
      message: 'Internal server error.',
    })
  }
})

app.delete('/banks/:id', async (request: Request, response: Response) => {
  const bankId = Number(request.params.id)
  const usecase = new RemoveBank(bankRepository)
  const input = {
    id: bankId,
  }
  try {
    await usecase.execute(input)
    return response.status(200).end()
  } catch (error: any) {
    if (error instanceof ApplicationError) {
      return response.status(422).json({
        code: error.code,
        message: error.message,
      })
    }
    return response.status(500).json({
      code: 'SERVER_ERROR',
      message: 'Internal server error.',
    })
  }
})

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})
