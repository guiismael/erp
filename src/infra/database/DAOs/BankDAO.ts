export interface BankDAO {
  save(dto: BankDAO.SaveDTO): Promise<number>
  list(): Promise<BankDAO.BankDTO[]>
  remove(bankId: number): Promise<void>
  getById(bankId: number): Promise<BankDAO.BankDTO | undefined>
  getByCode(code: string): Promise<BankDAO.BankDTO | undefined>
  getByName(string: string): Promise<BankDAO.BankDTO | undefined>
  update(dto: BankDAO.UpdateDTO): Promise<void>
}

export namespace BankDAO {
  export type SaveDTO = {
    code: string
    name: string
    url: string
  }

  export type UpdateDTO = {
    id: number
    code: string
    name: string
    url: string
  }

  export type BankDTO = {
    bank_id: number
    code: string
    name: string
    url: string
  }
}
