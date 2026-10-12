import { ApplicationError } from '@application/errors/ApplicationError.ts'
import { BankDAO } from '@infra/database/DAOs/BankDAO.ts'

import { PrismaClient } from './generated/client.ts'

export class BankDAOPrisma implements BankDAO {
  constructor(private prismaClient: PrismaClient) {}

  async save(dto: BankDAO.SaveDTO): Promise<number> {
    const savedBankModel =
      await this.prismaClient.bankPrismaPersistenceModel.create({
        data: {
          name: dto.name,
          code: dto.code,
          url: dto.url,
        },
      })
    return savedBankModel.bankId
  }

  async list(): Promise<BankDAO.BankDTO[]> {
    const bankModelList =
      await this.prismaClient.bankPrismaPersistenceModel.findMany()

    return bankModelList.map((bankModel) => ({
      bank_id: bankModel.bankId,
      code: bankModel.code,
      name: bankModel.name,
      url: bankModel.url,
    }))
  }

  async remove(bankId: number) {
    if (isNaN(bankId)) throw new ApplicationError('Invalid bank id.')
    await this.prismaClient.bankPrismaPersistenceModel.delete({
      where: {
        bankId,
      },
    })
  }

  async removeByCode(code: string) {
    await this.prismaClient.bankPrismaPersistenceModel.deleteMany({
      where: {
        code,
      },
    })
  }

  async removeByName(name: string) {
    await this.prismaClient.bankPrismaPersistenceModel.deleteMany({
      where: {
        name,
      },
    })
  }

  async getById(bankId: number): Promise<BankDAO.BankDTO | undefined> {
    const bankModel =
      await this.prismaClient.bankPrismaPersistenceModel.findFirst({
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
    const bankModel =
      await this.prismaClient.bankPrismaPersistenceModel.findFirst({
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
    const bankModel =
      await this.prismaClient.bankPrismaPersistenceModel.findFirst({
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
    await this.prismaClient.bankPrismaPersistenceModel.update({
      data: {
        name: dto.name,
        code: dto.code,
        url: dto.url,
      },
      where: {
        bankId: dto.id,
      },
    })
  }
}
