import axios from 'axios'
import mysqlConnection from 'mysql2/promise'

axios.defaults.validateStatus = () => true

const baseUrl = 'http://localhost:3000'

const connection = mysqlConnection.createPool(String(process.env.DATABASE_URL))

afterAll(() => {
  connection.pool.end()
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
  const fakeCode = `${Math.random()}`.substring(2, 5)
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

test.each([''])(
  'should not be able to create a bank with invalid name %s (POST /banks)',
  async (invalidName: any) => {
    const inputCreate = {
      code: '555',
      name: invalidName,
      url: 'test-invalid.com',
    }
    const responseCreate = await axios.post(`${baseUrl}/banks`, inputCreate)
    expect(responseCreate.status).toBe(422)
    const outputCreate = responseCreate.data
    expect(outputCreate.message).toBe('Invalid name.')
  },
)

test.each(['ABC'])(
  'should not be able to create a bank with invalid code %s (POST /banks)',
  async (invalidCode: any) => {
    const inputCreate = {
      code: invalidCode,
      name: 'Test Code',
      url: 'test-code.com',
    }
    const responseCreate = await axios.post(`${baseUrl}/banks`, inputCreate)
    expect(responseCreate.status).toBe(422)
    const outputCreate = responseCreate.data
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
  const responseCreate = await axios.post(`${baseUrl}/banks`, inputCreate)
  const outputCreate = responseCreate.data
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

test.each(['Test'])(
  'should not be able to alter a bank with invalid name %s (PUT /banks/:id)',
  async (invalidName: any) => {
    const bankId = 9_999_999
    const inputUpdate = {
      code: '123',
      name: invalidName,
      url: 'teste.changed.com',
    }
    const responseUpdate = await axios.put(
      `${baseUrl}/banks/${bankId}`,
      inputUpdate,
    )
    expect(responseUpdate.status).toBe(422)
    const outputUpdate = responseUpdate.data
    expect(outputUpdate.message).toBe('Invalid name.')
  },
)

test.each(['Test'])(
  'should not be able to alter a bank with invalid code %s (PUT /banks/:id)',
  async (invalidCode: any) => {
    const fakeCode = `${Math.random()}`.substring(2, 5)
    const inputCreate = {
      code: fakeCode,
      name: 'Test Code',
      url: 'teste.com',
    }
    const responseCreate = await axios.post(`${baseUrl}/banks`, inputCreate)
    const outputCreate = responseCreate.data
    const bankId = outputCreate.id
    const inputUpdate = {
      code: invalidCode,
      name: 'Test Code',
      url: 'teste.changed.com',
    }
    const responseUpdate = await axios.put(
      `${baseUrl}/banks/${bankId}`,
      inputUpdate,
    )
    expect(responseUpdate.status).toBe(422)
    const outputUpdate = responseUpdate.data
    expect(outputUpdate.message).toBe('Invalid code.')
    await axios.delete(`${baseUrl}/banks/${outputCreate.id}`)
  },
)

test('should not be able to update an inexistent bank (PUT /banks/:id)', async () => {
  const bankId = 9_999_999
  const inputUpdate = {
    code: '999',
    name: 'Inexistent Bank',
    url: 'update.inexistent.com',
  }
  const responseUpdate = await axios.put(
    `${baseUrl}/banks/${bankId}`,
    inputUpdate,
  )
  expect(responseUpdate.status).toBe(404)
  const outputUpdate = responseUpdate.data
  expect(outputUpdate.message).toBe('Bank not found.')
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
