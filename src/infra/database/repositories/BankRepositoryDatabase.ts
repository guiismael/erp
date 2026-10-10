import { ApplicationError } from '@application/errors/ApplicationError.ts'
import { BankRepository } from '@application/repositories/BankRepository.ts'
import { Bank } from '@domain/entities/Bank.ts'

import { BankDAO } from '../DAOs/BankDAO.ts'

export class BankRepositoryDatabase implements BankRepository {
  constructor(private bankDao: BankDAO) {}

  async save(bank: Bank): Promise<Bank> {
    const bankId = await this.bankDao.save({
      code: bank.getCode(),
      name: bank.getName(),
      url: bank.getUrl(),
    })
    const savedBank = Bank.restore({
      bankId,
      code: bank.getCode(),
      name: bank.getName(),
      url: bank.getUrl(),
    })
    return savedBank
  }

  async list(): Promise<Bank[]> {
    const rows = await this.bankDao.list()
    const bankList: Bank[] = []
    for (const row of rows) {
      const bank = Bank.restore({
        bankId: row.bank_id,
        code: row.code,
        name: row.name,
        url: row.url,
      })
      bankList.push(bank)
    }
    return bankList
  }

  async remove(bankId: number) {
    if (isNaN(bankId)) throw new ApplicationError('Invalid bank id.')
    await this.bankDao.remove(bankId)
  }

  async findById(bankId: number): Promise<Bank | undefined> {
    const firstRow = await this.bankDao.getById(bankId)
    if (!firstRow) return
    const bank = Bank.restore({
      bankId: firstRow.bank_id,
      code: firstRow.code,
      name: firstRow.name,
      url: firstRow.url,
    })
    return bank
  }

  async findByCode(code: string): Promise<Bank | undefined> {
    const firstRow = await this.bankDao.getByCode(code)
    if (!firstRow) return
    const bank = Bank.restore({
      bankId: firstRow.bank_id,
      code: firstRow.code,
      name: firstRow.name,
      url: firstRow.url,
    })
    return bank
  }

  async findByName(name: string): Promise<Bank | undefined> {
    const firstRow = await this.bankDao.getByName(name)
    if (!firstRow) return
    const bank = Bank.restore({
      bankId: firstRow.bank_id,
      code: firstRow.code,
      name: firstRow.name,
      url: firstRow.url,
    })
    return bank
  }

  async update(bank: Bank) {
    await this.bankDao.update({
      id: bank.getBankId(),
      code: bank.getCode(),
      name: bank.getName(),
      url: bank.getUrl(),
    })
  }
}
