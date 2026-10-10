import { PostgreSQLAdapter } from '@external/database/PostgreSQLAdapter.ts'
import { FetchAdapter } from '@external/http/FetchAdapter.ts'
import { DatabaseConnection } from '@infra/database/DatabaseConnection.ts'
import { HttpClient } from '@infra/http/HttpClient.ts'
import { HttpRestServer } from '@infra/http/HttpRestServer.ts'

const baseUrl = 'http://localhost:3000'
let connection: DatabaseConnection
let httpClient: HttpClient

beforeAll(() => {
  // connection = new MySQLAdapter(String(process.env.DATABASE_URL))
  // connection = new SQLiteAdapter(String(process.env.DATABASE_FILENAME))
  connection = new PostgreSQLAdapter(String(process.env.DATABASE_URL_PG))
  httpClient = new FetchAdapter()
})

afterAll(async () => {
  await connection.close()
})

test('should be able to return a bank list (GET /banks)', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const fakeName = `Name ${Math.random()}`
  await connection.query(`DELETE FROM banks WHERE code = ? OR name = ?`, [
    fakeCode,
    fakeName,
  ])
  const inputCreate = {
    code: fakeCode,
    name: fakeName,
    url: 'test.com',
  }
  const responseCreate = await httpClient.post(`${baseUrl}/banks`, inputCreate)
  const outputCreate = responseCreate.body
  const bankId = outputCreate.id
  const response = await httpClient.get(`${baseUrl}/banks`)
  const output = response.body
  expect(response.statusCode).toBe(HttpRestServer.StatusCode.Ok)
  expect(output).toBeInstanceOf(Array)
  expect(output.length).toBeGreaterThanOrEqual(1)
  const bankData = output.find((item) => item.id === bankId)
  expect(bankData).toBeTruthy()
  expect(bankData.id).toBe(bankId)
  expect(bankData.code).toBe(outputCreate.code)
  expect(bankData.name).toBe(outputCreate.name)
  expect(bankData.url).toBe(outputCreate.url)
  await httpClient.delete(`${baseUrl}/banks/${bankId}`)
})

test('should be able to return a bank (GET /banks/:id)', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const fakeName = `Name ${Math.random()}`
  await connection.query(`DELETE FROM banks WHERE code = ? OR name = ?`, [
    fakeCode,
    fakeName,
  ])
  const inputCreate = {
    code: fakeCode,
    name: fakeName,
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
  const fakeCode = `${Math.random()}`.substring(3, 6)
  const fakeName = `Name ${Math.random()}`
  await connection.query(`DELETE FROM banks WHERE code = ? OR name = ?`, [
    fakeCode,
    fakeName,
  ])
  const inputCreate = {
    code: fakeCode,
    name: fakeName,
    url: 'test-name.com',
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

test.each([''])(
  "should not be able to create a bank with invalid name '%s' (POST /banks)",
  async (invalidName: any) => {
    const inputCreate = {
      code: '555',
      name: invalidName,
      url: 'test-invalid.com',
    }
    const responseCreate = await httpClient.post(
      `${baseUrl}/banks`,
      inputCreate,
    )
    expect(responseCreate.statusCode).toBe(
      HttpRestServer.StatusCode.UnprocessableEntity,
    )
    const outputCreate = responseCreate.body
    expect(outputCreate.code).toBe('DOMAIN_ERROR')
    expect(outputCreate.message).toBe('Invalid name.')
  },
)

test.each(['ABC'])(
  "should not be able to create a bank with invalid code '%s' (POST /banks)",
  async (invalidCode: any) => {
    const inputCreate = {
      code: invalidCode,
      name: 'Test Code',
      url: 'test-code.com',
    }
    const responseCreate = await httpClient.post(
      `${baseUrl}/banks`,
      inputCreate,
    )
    expect(responseCreate.statusCode).toBe(
      HttpRestServer.StatusCode.UnprocessableEntity,
    )
    const outputCreate = responseCreate.body
    expect(outputCreate.code).toBe('DOMAIN_ERROR')
    expect(outputCreate.message).toBe('Invalid code.')
  },
)

test('should be able to alter a bank (PUT /banks/:id)', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const fakeName = `Name ${Math.random()}`
  await connection.query(`DELETE FROM banks WHERE code = ? OR name = ?`, [
    fakeCode,
    fakeName,
  ])
  const inputCreate = {
    code: fakeCode,
    name: fakeName,
    url: 'teste-name.com',
  }
  const responseCreate = await httpClient.post(`${baseUrl}/banks`, inputCreate)
  const outputCreate = responseCreate.body
  const bankId = outputCreate.id
  const fakeCodeUpdated = `${Math.random()}`.substring(2, 5)
  const fakeNameUpdated = `Name ${Math.random()} changed`
  await connection.query(`DELETE FROM banks WHERE code = ? OR name = ?`, [
    fakeCodeUpdated,
    fakeNameUpdated,
  ])
  const inputUpdate = {
    code: fakeCodeUpdated,
    name: fakeNameUpdated,
    url: 'teste4.changed.com',
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

test.each(['Test'])(
  "should not be able to alter a bank with invalid name '%s' (PUT /banks/:id)",
  async (invalidName: any) => {
    const fakeCode = `${Math.random()}`.substring(2, 5)
    const fakeName = `Name ${Math.random()}`
    await connection.query(
      `DELETE FROM banks WHERE code = ? OR name = ? OR name = ?`,
      [fakeCode, fakeName, invalidName],
    )
    const inputCreate = {
      code: fakeCode,
      name: fakeName,
      url: 'teste.put.com',
    }
    const responseCreate = await httpClient.post(
      `${baseUrl}/banks`,
      inputCreate,
    )
    const outputCreate = responseCreate.body
    const bankId = outputCreate.id
    const inputUpdate = {
      code: fakeCode,
      name: invalidName,
      url: 'teste.updated.com',
    }
    const responseUpdate = await httpClient.put(
      `${baseUrl}/banks/${bankId}`,
      inputUpdate,
    )
    expect(responseUpdate.statusCode).toBe(
      HttpRestServer.StatusCode.UnprocessableEntity,
    )
    const outputUpdate = responseUpdate.body
    expect(outputUpdate.code).toBe('DOMAIN_ERROR')
    expect(outputUpdate.message).toBe('Invalid name.')
    await httpClient.delete(`${baseUrl}/banks/${outputCreate.id}`)
  },
)

test.each(['Test'])(
  "should not be able to alter a bank with invalid code '%s' (PUT /banks/:id)",
  async (invalidCode: any) => {
    const fakeCode = `${Math.random()}`.substring(2, 5)
    const fakeName = `Test Name ${Math.random()}`
    await connection.query(`DELETE FROM banks WHERE code = ? or name = ?;`, [
      fakeCode,
      fakeName,
    ])
    const inputCreate = {
      code: fakeCode,
      name: fakeName,
      url: 'teste.com',
    }
    const responseCreate = await httpClient.post(
      `${baseUrl}/banks`,
      inputCreate,
    )
    const outputCreate = responseCreate.body
    const bankId = outputCreate.id
    const inputUpdate = {
      code: invalidCode,
      name: fakeName,
      url: 'teste.changed.com',
    }
    const responseUpdate = await httpClient.put(
      `${baseUrl}/banks/${bankId}`,
      inputUpdate,
    )
    expect(responseUpdate.statusCode).toBe(
      HttpRestServer.StatusCode.UnprocessableEntity,
    )
    const outputUpdate = responseUpdate.body
    expect(outputUpdate.code).toBe('DOMAIN_ERROR')
    expect(outputUpdate.message).toBe('Invalid code.')
    await httpClient.delete(`${baseUrl}/banks/${outputCreate.id}`)
  },
)

test('should not be able to update an inexistent bank (PUT /banks/:id)', async () => {
  const bankId = 9_999_999
  const inputUpdate = {
    code: '999',
    name: 'Inexistent Bank',
    url: 'update.inexistent.com',
  }
  const responseUpdate = await httpClient.put(
    `${baseUrl}/banks/${bankId}`,
    inputUpdate,
  )
  expect(responseUpdate.statusCode).toBe(HttpRestServer.StatusCode.NotFound)
  const outputUpdate = responseUpdate.body
  expect(outputUpdate.code).toBe('NOT_FOUND_ERROR')
  expect(outputUpdate.message).toBe('Bank not found.')
})

test('should not be able to delete a bank with invalid id (DELETE /banks/:invalidId)', async () => {
  const responseDelete = await httpClient.delete(`${baseUrl}/banks/abc`)
  expect(responseDelete.statusCode).toBe(
    HttpRestServer.StatusCode.UnprocessableEntity,
  )
  expect(responseDelete.body.code).toBe('APPLICATION_ERROR')
  expect(responseDelete.body.message).toBe('Invalid bank id.')
})

test('should be able to delete a bank (DELETE /banks/:id)', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const fakeName = `Name ${Math.random()}`
  await connection.query(`DELETE FROM banks WHERE code = ? OR name = ?`, [
    fakeCode,
    fakeName,
  ])
  const inputCreate = {
    code: fakeCode,
    name: fakeName,
    url: 'teste_delete.com',
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

test('should be able to return 404 if bank not found (GET /banks/:id)', async () => {
  const responseGet = await httpClient.get(`${baseUrl}/banks/${9_999_999}`)
  expect(responseGet.statusCode).toBe(404)
  const outputGet = responseGet.body
  expect(outputGet.code).toBe('NOT_FOUND_ERROR')
  expect(outputGet.message).toBe('Bank not found.')
})
