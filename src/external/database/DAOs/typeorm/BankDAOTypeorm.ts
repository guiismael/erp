import { ApplicationError } from '@application/errors/ApplicationError.ts'
import { BankDAO } from '@infra/database/DAOs/BankDAO.ts'
import { DataSource, Repository } from 'typeorm'

import { BankTypeormPersistenceModel } from './BankTypeormPersistenceModel.ts'

export class BankDAOTypeorm implements BankDAO {
  private repository: Repository<BankTypeormPersistenceModel>
  constructor(datasource: DataSource) {
    this.repository = datasource.getRepository(BankTypeormPersistenceModel)
  }

  async save(dto: BankDAO.SaveDTO): Promise<number> {
    const bankModel = new BankTypeormPersistenceModel()
    bankModel.code = dto.code
    bankModel.name = dto.name
    bankModel.url = dto.url
    const savedBankModel = await this.repository.save(bankModel)
    return savedBankModel.bankId
  }

  async list(): Promise<BankDAO.BankDTO[]> {
    const bankModelList = await this.repository.find()

    return bankModelList.map((bankModel) => ({
      bank_id: bankModel.bankId,
      code: bankModel.code,
      name: bankModel.name,
      url: bankModel.url,
    }))
  }

  async remove(bankId: number) {
    if (isNaN(bankId)) throw new ApplicationError('Invalid bank id.')
    await this.repository.delete({
      bankId,
    })
  }

  async getById(bankId: number): Promise<BankDAO.BankDTO | undefined> {
    const bankModel = await this.repository.findOne({
      where: {
        bankId,
      },
    })
    if (!bankModel) return
    return {
      bank_id: bankModel.bankId,
      code: bankModel.code,
      name: bankModel.name,
      url: bankModel.url,
    }
  }

  async getByCode(code: string): Promise<BankDAO.BankDTO | undefined> {
    const bankModel = await this.repository.findOne({
      where: {
        code,
      },
    })
    if (!bankModel) return
    return {
      bank_id: bankModel.bankId,
      code: bankModel.code,
      name: bankModel.name,
      url: bankModel.url,
    }
  }

  async getByName(name: string): Promise<BankDAO.BankDTO | undefined> {
    const bankModel = await this.repository.findOne({
      where: {
        name,
      },
    })
    if (!bankModel) return
    return {
      bank_id: bankModel.bankId,
      code: bankModel.code,
      name: bankModel.name,
      url: bankModel.url,
    }
  }

  async update(dto: BankDAO.UpdateDTO) {
    const bankModel = new BankTypeormPersistenceModel()
    bankModel.bankId = dto.id
    bankModel.code = dto.code
    bankModel.name = dto.name
    bankModel.url = dto.url
    await this.repository.save(bankModel)
  }
}
