import { BankDAO } from '@BankDAO.ts'

export class BankDAOFake implements BankDAO {
  private bankList: any[]
  constructor() {
    this.bankList = []
  }

  async save(dto: any): Promise<number> {
    const newId = this.bankList.length + 1
    this.bankList.push({ bank_id: newId, ...dto })
    return newId
  }

  async list(): Promise<any[]> {
    return this.bankList
  }

  async remove(bankId: number): Promise<void> {
    this.bankList = this.bankList.filter(
      (bankData) => bankData.bank_id !== bankId,
    )
  }

  async getById(bankId: number): Promise<any> {
    return this.bankList.find((bankData) => bankData.bank_id === bankId)
  }

  async update(dto: any): Promise<void> {
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
