import { BankDAO } from '@BankDAO.ts'
import { UpdateBank } from '@UpdateBank.ts'
import Sinon from 'sinon'

let bankDao: BankDAO
let sut: UpdateBank

beforeAll(() => {
  bankDao = new BankDAO()
  sut = new UpdateBank(bankDao)
})

afterEach(() => {
  Sinon.restore()
})

test('should be able to alter a bank data', async () => {
  const inputCreate = {
    code: '553',
    name: `Test Name`,
    url: 'teste4.com',
  }
  const bankIdTest = 1
  Sinon.stub(bankDao, 'save').resolves(bankIdTest)
  const bankId = await bankDao.save(inputCreate)
  const inputUpdate = {
    id: bankId,
    code: '553',
    name: 'Test Name Changed',
    url: 'teste4.changed.com',
  }
  const getByIdStub = Sinon.stub(bankDao, 'getById').resolves({
    bank_id: bankIdTest,
    name: '',
    code: '',
    url: '',
  })
  const outputUpdate = await sut.execute(inputUpdate)
  expect(outputUpdate.id).toBe(bankId)
  expect(outputUpdate.code).toBe(inputUpdate.code)
  expect(outputUpdate.name).toBe(inputUpdate.name)
  expect(outputUpdate.url).toBe(inputUpdate.url)
  getByIdStub.resolves({
    bank_id: bankIdTest,
    code: '553',
    name: 'Test Name Changed',
    url: 'teste4.changed.com',
  })
  const outputGet = await bankDao.getById(bankId)
  expect(outputGet).toBeTruthy()
  expect(outputGet.bank_id).toBe(bankId)
  expect(outputGet.code).toBe(inputUpdate.code)
  expect(outputGet.name).toBe(inputUpdate.name)
  expect(outputGet.url).toBe(inputUpdate.url)
  Sinon.stub(bankDao, 'remove').resolves()
  await bankDao.remove(bankId)
})
