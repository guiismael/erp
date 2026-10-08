import axios from 'axios'
import mysqlConnection from 'mysql2/promise'

axios.defaults.validateStatus = () => true

const baseUrl = 'http://localhost:3000'
const connection = mysqlConnection.createPool(String(process.env.DATABASE_URL))

afterAll(() => {
  connection.pool.end()
})

test('should be able to return a bank list (GET /banks)', async () => {
  const bankCode = '123'
  await connection.query(`DELETE FROM banks WHERE code = ?;`, [bankCode])
  const inputCreate = {
    code: bankCode,
    name: `Test List ${Math.random()}`,
    url: 'test-list.com',
  }
  const responseCreate = await axios.post(`${baseUrl}/banks`, inputCreate)
  const outputCreate = responseCreate.data
  const bankId = outputCreate.id
  const response = await axios.get(`${baseUrl}/banks`)
  const output = response.data
  expect(response.status).toBe(200)
  expect(output).toBeInstanceOf(Array)
  expect(output.length).toBeGreaterThanOrEqual(1)
  const bankData = output.find((item) => item.id === bankId)
  expect(bankData).toBeTruthy()
  expect(bankData.id).toBe(bankId)
  expect(bankData.code).toBe(outputCreate.code)
  expect(bankData.name).toBe(outputCreate.name)
  expect(bankData.url).toBe(outputCreate.url)
  await axios.delete(`${baseUrl}/banks/${bankId}`)
})

test('should be able to return a bank (GET /banks/:id)', async () => {
  const inputCreate = {
    code: '234',
    name: 'Test Get One',
    url: 'test-get-one.com',
  }
  const responseCreate = await axios.post(`${baseUrl}/banks`, inputCreate)
  const outputCreate = responseCreate.data
  const bankId = outputCreate.id
  const response = await axios.get(`${baseUrl}/banks/${bankId}`)
  const output = response.data
  expect(response.status).toBe(200)
  expect(output.id).toBe(bankId)
  expect(output.code).toBe(inputCreate.code)
  expect(output.name).toBe(inputCreate.name)
  expect(output.url).toBe(inputCreate.url)
  await axios.delete(`${baseUrl}/banks/${bankId}`)
})

test('should be able to create a bank (POST /banks)', async () => {
  const inputCreate = {
    code: '345',
    name: 'Test create',
    url: 'test-create.com',
  }
  const responseCreate = await axios.post(`${baseUrl}/banks`, inputCreate)
  const outputCreate = responseCreate.data
  expect(responseCreate.status).toBe(201)
  expect(outputCreate.id).toBeTruthy()
  expect(outputCreate.code).toBe(inputCreate.code)
  expect(outputCreate.name).toBe(inputCreate.name)
  expect(outputCreate.url).toBe(inputCreate.url)
  const responseGet = await axios.get(`${baseUrl}/banks/${outputCreate.id}`)
  const outputGet = responseGet.data
  expect(outputGet.id).toBe(outputCreate.id)
  expect(outputGet.code).toBe(inputCreate.code)
  expect(outputGet.name).toBe(inputCreate.name)
  expect(outputGet.url).toBe(inputCreate.url)
  await axios.delete(`${baseUrl}/banks/${outputCreate.id}`)
})

test('should be able to alter a bank (PUT /banks/:id)', async () => {
  const inputCreate = {
    code: '456',
    name: 'Test Name',
    url: 'teste-name-changed.com',
  }
  const responseCreate = await axios.post(`${baseUrl}/banks`, inputCreate)
  const outputCreate = responseCreate.data
  const bankId = outputCreate.id
  const inputUpdate = {
    code: '456',
    name: 'Test Name Changed',
    url: 'teste.changed.com',
  }
  const responseUpdate = await axios.put(
    `${baseUrl}/banks/${bankId}`,
    inputUpdate,
  )
  const outputUpdate = responseUpdate.data
  expect(responseUpdate.status).toBe(200)
  expect(outputUpdate.id).toBe(bankId)
  expect(outputUpdate.code).toBe(inputUpdate.code)
  expect(outputUpdate.name).toBe(inputUpdate.name)
  expect(outputUpdate.url).toBe(inputUpdate.url)
  const responseGet = await axios.get(`${baseUrl}/banks/${outputCreate.id}`)
  const outputGet = responseGet.data
  expect(outputGet.id).toBe(outputCreate.id)
  expect(outputGet.code).toBe(inputUpdate.code)
  expect(outputGet.name).toBe(inputUpdate.name)
  expect(outputGet.url).toBe(inputUpdate.url)
  await axios.delete(`${baseUrl}/banks/${outputCreate.id}`)
})

test('should be able to delete a bank (DELETE /banks/:id)', async () => {
  const inputCreate = {
    code: '567',
    name: 'Test Delete',
    url: 'teste-delete.com',
  }
  const responseCreate = await axios.post(`${baseUrl}/banks`, inputCreate)
  const outputCreate = responseCreate.data
  const bankId = outputCreate.id
  expect(bankId).toBeTruthy()
  const responseDelete = await axios.delete(`${baseUrl}/banks/${bankId}`)
  expect(responseDelete.status).toBe(200)
  const responseGet = await axios.get(`${baseUrl}/banks/${bankId}`)
  expect(responseGet.status).toBe(404)
  expect(responseGet.data?.id).toBeFalsy()
})
