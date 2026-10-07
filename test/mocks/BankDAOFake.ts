import { BankDAO } from '@BankDAO.ts'

export class BankDAOFake implements BankDAO {
  private bankList: BankDAO.BankDTO[]
  constructor() {
    this.bankList = []
  }

  async save(dto: BankDAO.SaveDTO): Promise<number> {
    const newId = this.bankList.length + 1
    this.bankList.push({
      bank_id: newId,
      code: dto.code,
      name: dto.name,
      url: dto.url,
    })
    return newId
  }

  async list(): Promise<BankDAO.BankDTO[]> {
    return this.bankList
  }

  async remove(bankId: number): Promise<void> {
    this.bankList = this.bankList.filter(
      (bankData) => bankData.bank_id !== bankId,
    )
  }

  async getById(bankId: number): Promise<BankDAO.BankDTO | undefined> {
    return this.bankList.find((bankData) => bankData.bank_id === bankId)
  }

  async getByCode(code: string): Promise<BankDAO.BankDTO | undefined> {
    return this.bankList.find((bankData) => bankData.code === code)
  }

  async getByName(name: string): Promise<BankDAO.BankDTO | undefined> {
    return this.bankList.find((bankData) => bankData.name === name)
  }

  async update(dto: BankDAO.UpdateDTO): Promise<void> {
    this.bankList = this.bankList.map((bankData) => {
      if (bankData.bank_id === dto.id) {
        return {
          bank_id: dto.id,
          code: dto.code ?? bankData.code,
          name: dto.name ?? bankData.name,
          url: dto.url ?? bankData.url,
        }
      }
      return bankData
    })
  }
}
