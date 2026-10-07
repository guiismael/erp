import { BankDAO } from '@BankDAO.ts'
import { UseCase } from '@UseCase.ts'

export class CreateBank implements UseCase<
  CreateBank.Input,
  CreateBank.Output
> {
  constructor(private bankDao: BankDAO) {}

  async execute(input: CreateBank.Input): Promise<CreateBank.Output> {
    if (!input.name || !input.name.match(/^.+\s.+$/)) {
      throw new Error('Invalid name.')
    }
    if (
      !input.code ||
      input.code.length !== 3 ||
      input.code.replace(/\D/g, '').length !== 3
    ) {
      throw new Error('Invalid code.')
    }
    const alreadyExistsWithCode = await this.bankDao.getByCode(input.code)
    if (alreadyExistsWithCode)
      throw new Error('A bank with this code already exists.')
    const alreadyExistsWithName = await this.bankDao.getByName(input.name)
    if (alreadyExistsWithName)
      throw new Error('A bank with this name already exists.')
    const bankId = await this.bankDao.save(input)
    const output = {
      id: bankId,
      ...input,
    }
    return output
  }
}

export namespace CreateBank {
  export type Input = {
    code: string
    name: string
    url: string
  }

  export type Output = {
    id: number
    code: string
    name: string
    url: string
  }
}
