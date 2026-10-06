import { alterBank } from '@alterBank.ts'
import { getById, remove, save } from '@database.ts'

test('should be able to alter a bank data', async () => {
  const inputCreate = {
    code: '553',
    name: `Test Name`,
    url: 'teste4.com',
  }
  const bankId = await save(inputCreate)
  const inputUpdate = {
    id: bankId,
    code: '553',
    name: 'Test Name Changed',
    url: 'teste4.changed.com',
  }
  const outputUpdate = await alterBank(inputUpdate)
  expect(outputUpdate.id).toBe(bankId)
  expect(outputUpdate.code).toBe(inputUpdate.code)
  expect(outputUpdate.name).toBe(inputUpdate.name)
  expect(outputUpdate.url).toBe(inputUpdate.url)
  const outputGet = await getById(bankId)
  expect(outputGet).toBeTruthy()
  expect(outputGet.bank_id).toBe(bankId)
  expect(outputGet.code).toBe(inputUpdate.code)
  expect(outputGet.name).toBe(inputUpdate.name)
  expect(outputGet.url).toBe(inputUpdate.url)
  await remove(bankId)
})
