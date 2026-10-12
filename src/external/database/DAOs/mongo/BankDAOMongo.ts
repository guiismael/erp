import { ApplicationError } from '@application/errors/ApplicationError.ts'
import { BankDAO } from '@infra/database/DAOs/BankDAO.ts'
import { Collection, MongoClient } from 'mongodb'

import { BankMongoPersistenceModel } from './persistenceModels.ts'

export class BankDAOMongo implements BankDAO {
  private collection: Collection<BankMongoPersistenceModel>

  constructor(private mongoClient: MongoClient) {
    this.collection = mongoClient
      .db()
      .collection<BankMongoPersistenceModel>('banks')
  }

  async save(dto: BankDAO.SaveDTO): Promise<number> {
    const lastBank = await this.collection.findOne(
      {},
      {
        sort: { _id: -1 },
      },
    )
    const bankId = (lastBank?._id ?? 0) + 1
    await this.collection.insertOne({
      _id: bankId,
      code: dto.code,
      name: dto.name,
      url: dto.url,
    })
    return bankId
  }

  async list(): Promise<BankDAO.BankDTO[]> {
    const bankModelList = await this.collection.find({}).toArray()
    return bankModelList.map((bankModel) => ({
      bank_id: bankModel._id,
      code: bankModel.code,
      name: bankModel.name,
      url: bankModel.url,
    }))
  }

  async remove(bankId: number) {
    if (isNaN(bankId)) throw new ApplicationError('Invalid bank id.')
    await this.collection.deleteOne({
      _id: bankId,
    })
  }

  async removeByCode(code: string) {
    await this.collection.deleteOne({
      code,
    })
  }

  async removeByName(name: string) {
    await this.collection.deleteOne({
      name,
    })
  }

  async getById(bankId: number): Promise<BankDAO.BankDTO | undefined> {
    const bankModel = await this.collection.findOne({
      _id: bankId,
    })
    if (!bankModel) return
    return {
      bank_id: bankModel._id,
      code: bankModel.code,
      name: bankModel.name,
      url: bankModel.url,
    }
  }

  async getByCode(code: string): Promise<BankDAO.BankDTO | undefined> {
    const bankModel = await this.collection.findOne({
      code,
    })
    if (!bankModel) return
    return {
      bank_id: bankModel._id,
      code: bankModel.code,
      name: bankModel.name,
      url: bankModel.url,
    }
  }

  async getByName(name: string): Promise<BankDAO.BankDTO | undefined> {
    const bankModel = await this.collection.findOne({
      name,
    })
    if (!bankModel) return
    return {
      bank_id: bankModel._id,
      code: bankModel.code,
      name: bankModel.name,
      url: bankModel.url,
    }
  }

  async update(dto: BankDAO.UpdateDTO) {
    await this.collection.updateOne(
      {
        _id: dto.id,
      },
      {
        $set: {
          code: dto.code,
          name: dto.name,
          url: dto.url,
        },
      },
    )
  }
}
