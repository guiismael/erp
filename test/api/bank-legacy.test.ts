import { HttpRestServer } from '@BankRestController.ts'
import { DatabaseConnection } from '@DatabaseConnection.ts'
import { FetchAdapter } from '@FetchAdapter.ts'
import { HttpClient } from '@HttpClient.ts'
import { MySQLAdapter } from '@MySQLAdapter.ts'

const baseUrl = 'http://localhost:3000'
let connection: DatabaseConnection
let httpClient: HttpClient

beforeAll(() => {
  connection = new MySQLAdapter(String(process.env.DATABASE_URL))
  httpClient = new FetchAdapter()
})

afterAll(async () => {
  await connection.close()
})

test('should be able to return a bank list (GET /banks)', async () => {
  const bankCode = '135'
  await connection.query(`DELETE FROM banks WHERE code = ?;`, [bankCode])
  const inputCreate = {
    code: bankCode,
    name: `Test List ${Math.random()}`,
    url: 'test-list.com',
  }
  const responseCreate = await httpClient.post(`${baseUrl}/banks`, inputCreate)
  const outputCreate = responseCreate.body
  const bankId = outputCreate.id
  const response = await httpClient.get(`${baseUrl}/banks`)
  const output = response.body
  expect(response.statusCode).toBe(HttpRestServer.StatusCode.Ok)
  expect(output).toBeInstanceOf(Array)
  expect(output.length).toBeGreaterThanOrEqual(1)
  const bankData = output.find((item: any) => item.id === bankId)
  expect(bankData).toBeTruthy()
  expect(bankData.id).toBe(bankId)
  expect(bankData.code).toBe(outputCreate.code)
  expect(bankData.name).toBe(outputCreate.name)
  expect(bankData.url).toBe(outputCreate.url)
  await httpClient.delete(`${baseUrl}/banks/${bankId}`)
})

test('should be able to return a bank (GET /banks/:id)', async () => {
  await connection.query(`DELETE FROM banks WHERE code = ?;`, ['234'])
  const inputCreate = {
    code: '234',
    name: 'Test Get One',
    url: 'test-get-one.com',
  }
  const responseCreate = await httpClient.post(`${baseUrl}/banks`, inputCreate)
  const outputCreate = responseCreate.body
  const bankId = outputCreate.id
  const response = await httpClient.get(`${baseUrl}/banks/${bankId}`)
  const output = response.body
  expect(response.statusCode).toBe(HttpRestServer.StatusCode.Ok)
  expect(output.id).toBe(bankId)
  expect(output.code).toBe(inputCreate.code)
  expect(output.name).toBe(inputCreate.name)
  expect(output.url).toBe(inputCreate.url)
  await httpClient.delete(`${baseUrl}/banks/${bankId}`)
})

test('should be able to create a bank (POST /banks)', async () => {
  await connection.query(`DELETE FROM banks WHERE code = ?;`, ['345'])
  const inputCreate = {
    code: '345',
    name: `Test Name ${Math.random()}`,
    url: 'test-create.com',
  }
  const responseCreate = await httpClient.post(`${baseUrl}/banks`, inputCreate)
  const outputCreate = responseCreate.body
  expect(responseCreate.statusCode).toBe(HttpRestServer.StatusCode.Created)
  expect(outputCreate.id).toBeTruthy()
  expect(outputCreate.code).toBe(inputCreate.code)
  expect(outputCreate.name).toBe(inputCreate.name)
  expect(outputCreate.url).toBe(inputCreate.url)
  const responseGet = await httpClient.get(
    `${baseUrl}/banks/${outputCreate.id}`,
  )
  const outputGet = responseGet.body
  expect(outputGet.id).toBe(outputCreate.id)
  expect(outputGet.code).toBe(inputCreate.code)
  expect(outputGet.name).toBe(inputCreate.name)
  expect(outputGet.url).toBe(inputCreate.url)
  await httpClient.delete(`${baseUrl}/banks/${outputCreate.id}`)
})

test('should be able to alter a bank (PUT /banks/:id)', async () => {
  const bankCode = '456'
  await connection.query(`DELETE FROM banks WHERE code = ?`, [bankCode])
  const inputCreate = {
    code: bankCode,
    name: 'Test Name',
    url: 'teste-name-changed.com',
  }
  const responseCreate = await httpClient.post(`${baseUrl}/banks`, inputCreate)
  const outputCreate = responseCreate.body
  const bankId = outputCreate.id
  const randomName = `Name Changed ${Math.random()}`
  const inputUpdate = {
    code: bankCode,
    name: randomName,
    url: 'teste.changed.com',
  }
  const responseUpdate = await httpClient.put(
    `${baseUrl}/banks/${bankId}`,
    inputUpdate,
  )
  const outputUpdate = responseUpdate.body
  expect(responseUpdate.statusCode).toBe(HttpRestServer.StatusCode.Ok)
  expect(outputUpdate.id).toBe(bankId)
  expect(outputUpdate.code).toBe(inputUpdate.code)
  expect(outputUpdate.name).toBe(inputUpdate.name)
  expect(outputUpdate.url).toBe(inputUpdate.url)
  const responseGet = await httpClient.get(
    `${baseUrl}/banks/${outputCreate.id}`,
  )
  const outputGet = responseGet.body
  expect(outputGet.id).toBe(outputCreate.id)
  expect(outputGet.code).toBe(inputUpdate.code)
  expect(outputGet.name).toBe(inputUpdate.name)
  expect(outputGet.url).toBe(inputUpdate.url)
  await httpClient.delete(`${baseUrl}/banks/${outputCreate.id}`)
})

test('should be able to delete a bank (DELETE /banks/:id)', async () => {
  await connection.query(`DELETE FROM banks WHERE code = ?;`, ['567'])
  const inputCreate = {
    code: '567',
    name: 'Test Delete',
    url: 'teste-delete.com',
  }
  const responseCreate = await httpClient.post(`${baseUrl}/banks`, inputCreate)
  const outputCreate = responseCreate.body
  const bankId = outputCreate.id
  expect(bankId).toBeTruthy()
  const responseDelete = await httpClient.delete(`${baseUrl}/banks/${bankId}`)
  expect(responseDelete.statusCode).toBe(HttpRestServer.StatusCode.Ok)
  const responseGet = await httpClient.get(`${baseUrl}/banks/${bankId}`)
  expect(responseGet.statusCode).toBe(HttpRestServer.StatusCode.NotFound)
  expect(responseGet.body?.id).toBeFalsy()
})
