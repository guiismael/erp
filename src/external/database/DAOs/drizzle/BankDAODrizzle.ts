import { ApplicationError } from '@application/errors/ApplicationError.ts'
import { BankDAO } from '@infra/database/DAOs/BankDAO.ts'
import { eq } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'

import { bankDrizzlePersistenceModel } from './schema.ts'

export class BankDAODrizzle implements BankDAO {
  constructor(private dataSource: NodePgDatabase) {}

  async save(dto: BankDAO.SaveDTO): Promise<number> {
    const [bankInsertedModel] = await this.dataSource
      .insert(bankDrizzlePersistenceModel)
      .values({
        code: dto.code,
        name: dto.name,
        url: dto.url,
      })
      .returning()
    return bankInsertedModel.bankId
  }

  async list(): Promise<BankDAO.BankDTO[]> {
    const bankModelList = await this.dataSource
      .select()
      .from(bankDrizzlePersistenceModel)
    return bankModelList.map((bankModel) => ({
      bank_id: bankModel.bankId,
      code: bankModel.code,
      name: bankModel.name,
      url: bankModel.url,
    }))
  }

  async remove(bankId: number) {
    if (isNaN(bankId)) throw new ApplicationError('Invalid bank id.')
    await this.dataSource
      .delete(bankDrizzlePersistenceModel)
      .where(eq(bankDrizzlePersistenceModel.bankId, bankId))
  }

  async getById(bankId: number): Promise<BankDAO.BankDTO | undefined> {
    const [bankModel] = await this.dataSource
      .select()
      .from(bankDrizzlePersistenceModel)
      .where(eq(bankDrizzlePersistenceModel.bankId, bankId))
    if (!bankModel) return
    return {
      bank_id: bankModel.bankId,
      code: bankModel.code,
      name: bankModel.name,
      url: bankModel.url,
    }
  }

  async getByCode(code: string): Promise<BankDAO.BankDTO | undefined> {
    const [bankModel] = await this.dataSource
      .select()
      .from(bankDrizzlePersistenceModel)
      .where(eq(bankDrizzlePersistenceModel.code, code))
    if (!bankModel) return
    return {
      bank_id: bankModel.bankId,
      code: bankModel.code,
      name: bankModel.name,
      url: bankModel.url,
    }
  }

  async getByName(name: string): Promise<BankDAO.BankDTO | undefined> {
    const [bankModel] = await this.dataSource
      .select()
      .from(bankDrizzlePersistenceModel)
      .where(eq(bankDrizzlePersistenceModel.name, name))
    if (!bankModel) return
    return {
      bank_id: bankModel.bankId,
      code: bankModel.code,
      name: bankModel.name,
      url: bankModel.url,
    }
  }

  async update(dto: BankDAO.UpdateDTO) {
    await this.dataSource
      .update(bankDrizzlePersistenceModel)
      .set({
        name: dto.name,
        code: dto.code,
        url: dto.url,
      })
      .where(eq(bankDrizzlePersistenceModel.bankId, dto.id))
  }
}
