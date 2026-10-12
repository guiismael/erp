import { mongoDatasourceFactory } from '@external/database/DAOs/mongo/factory.ts'
import { PostgreSQLAdapter } from '@external/database/PostgreSQLAdapter.ts'
import { FetchAdapter } from '@external/http/FetchAdapter.ts'
import { BankDAO } from '@infra/database/DAOs/BankDAO.ts'
import { BankDAOSQL } from '@infra/database/DAOs/BankDAOSQL.ts'
import { DatabaseConnection } from '@infra/database/DatabaseConnection.ts'
import { HttpClient } from '@infra/http/HttpClient.ts'
import { HttpRestServer } from '@infra/http/HttpRestServer.ts'
import { MongoClient } from 'mongodb'

const baseUrl = 'http://localhost:3000'
let httpClient: HttpClient
let connection: DatabaseConnection
let dataSource: MongoClient
let bankDao: BankDAO

beforeAll(async () => {
  httpClient = new FetchAdapter()
  // connection = new MySQLAdapter(String(process.env.DATABASE_URL))
  connection = new PostgreSQLAdapter(String(process.env.DATABASE_URL_PG))
  // connection = new SQLiteAdapter(String(process.env.DATABASE_FILENAME))
  dataSource = await mongoDatasourceFactory(
    String(process.env.DATABASE_URL_MONGO),
  )
  bankDao = new BankDAOSQL(connection)
  // bankDao = new BankDAOMongo(dataSource)
})

afterAll(async () => {
  await connection.close()
  await dataSource.close()
})

test('should be able to return a bank list (GET /banks)', async () => {
  const bankCode = `${Math.random()}`.substring(2, 5)
  await bankDao.removeByCode(bankCode)
  const inputCreate = {
    code: bankCode,
    name: `Test List ${Math.random()}`,
    url: 'test-list.com',
  }
  const responseCreate = await httpClient.post(`${baseUrl}/banks`, inputCreate)
  expect(responseCreate.statusCode).toBe(HttpRestServer.StatusCode.Created)
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
  const bankCode = `${Math.random()}`.substring(2, 5)
  await bankDao.removeByCode(bankCode)
  const inputCreate = {
    code: bankCode,
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
  const bankCode = `${Math.random()}`.substring(2, 5)
  await bankDao.removeByCode(bankCode)
  const inputCreate = {
    code: bankCode,
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
  const bankCode = `${Math.random()}`.substring(2, 5)
  const bankName = `Bank ${Math.random()}`
  await bankDao.removeByCode(bankCode)
  await bankDao.removeByName(bankCode)
  const inputCreate = {
    code: bankCode,
    name: bankName,
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
  const bankCode = `${Math.random()}`.substring(2, 5)
  await bankDao.removeByCode(bankCode)
  const inputCreate = {
    code: bankCode,
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
