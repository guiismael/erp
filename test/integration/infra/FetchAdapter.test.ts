import { FetchAdapter } from '@external/http/FetchAdapter.ts'
import { HttpClient } from '@infra/http/HttpClient.ts'
import nock from 'nock'
import Sinon from 'sinon'

let sut: HttpClient

beforeAll(() => {
  sut = new FetchAdapter()
})

afterEach(() => {
  Sinon.restore()
  nock.cleanAll()
})

test('should call fetch get correctly and return correct data when request GET return 2xx', async () => {
  const url = 'http://localhost:4321'
  const path = '/user'
  const expectedCode = 200
  const expectedBody = {
    test: 'test',
  }
  nock(url).get(path).reply(expectedCode, expectedBody)
  const fetchSpy = Sinon.spy(globalThis, 'fetch')
  const response = await sut.get(`${url}${path}`)
  expect(fetchSpy.calledOnce).toBeTruthy()
  expect(fetchSpy.calledWith(`${url}${path}`)).toBeTruthy()
  expect(response.statusCode).toBe(expectedCode)
  expect(response.body.test).toBe(expectedBody.test)
})

test('should call fetch get correctly and return correct data when request GET return 4xx', async () => {
  const url = 'http://localhost:4321'
  const path = '/user'
  const expectedCode = 400
  const expectedBody = {
    test: 'test',
  }
  nock(url).get(path).reply(expectedCode, expectedBody)
  const fetchSpy = Sinon.spy(globalThis, 'fetch')
  const response = await sut.get(`${url}${path}`)
  expect(fetchSpy.calledOnce).toBeTruthy()
  expect(fetchSpy.calledWith(`${url}${path}`)).toBeTruthy()
  expect(response.statusCode).toBe(expectedCode)
  expect(response.body.test).toBe(expectedBody.test)
})

test('should call fetch get correctly and return correct data when request GET return 5xx', async () => {
  const url = 'http://localhost:4321'
  const path = '/user'
  const expectedCode = 500
  const expectedBody = {
    test: 'test',
  }
  nock(url).get(path).reply(expectedCode, expectedBody)
  const fetchSpy = Sinon.spy(globalThis, 'fetch')
  const response = await sut.get(`${url}${path}`)
  expect(fetchSpy.calledOnce).toBeTruthy()
  expect(fetchSpy.calledWith(`${url}${path}`)).toBeTruthy()
  expect(response.statusCode).toBe(expectedCode)
  expect(response.body.test).toBe(expectedBody.test)
})

test('should call fetch post correctly and return correct data when request POST return 2xx', async () => {
  const url = 'http://localhost:4321'
  const path = '/user'
  const expectedCode = 201
  const expectedBody = {
    test: 'test',
  }
  nock(url).post(path).reply(expectedCode, expectedBody)
  const fetchSpy = Sinon.spy(globalThis, 'fetch')
  const response = await sut.post(`${url}${path}`, expectedBody)
  expect(fetchSpy.calledOnce).toBeTruthy()
  expect(
    fetchSpy.calledWith(`${url}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expectedBody),
    }),
  ).toBeTruthy()
  expect(response.statusCode).toBe(expectedCode)
  expect(response.body.test).toBe(expectedBody.test)
})

test('should call fetch put correctly and return correct data when request PUT return 2xx', async () => {
  const url = 'http://localhost:4321'
  const path = '/user'
  const expectedCode = 200
  const expectedBody = {
    test: 'test',
  }
  nock(url).put(path).reply(expectedCode, expectedBody)
  const fetchSpy = Sinon.spy(globalThis, 'fetch')
  const response = await sut.put(`${url}${path}`, expectedBody)
  expect(fetchSpy.calledOnce).toBeTruthy()
  expect(
    fetchSpy.calledWith(`${url}${path}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expectedBody),
    }),
  ).toBeTruthy()
  expect(response.statusCode).toBe(expectedCode)
  expect(response.body.test).toBe(expectedBody.test)
})

test('should call fetch delete correctly and return correct data when request DELETE return 2xx', async () => {
  const url = 'http://localhost:4321'
  const path = '/user'
  const expectedCode = 200
  const expectedBody = {
    test: 'test',
  }
  nock(url).delete(path).reply(expectedCode, expectedBody)
  const fetchSpy = Sinon.spy(globalThis, 'fetch')
  const response = await sut.delete(`${url}${path}`)
  expect(fetchSpy.calledOnce).toBeTruthy()
  expect(fetchSpy.calledWith(`${url}${path}`)).toBeTruthy()
  expect(response.statusCode).toBe(expectedCode)
  expect(response.body.test).toBe(expectedBody.test)
})

test('should return an empty body when the call return an empty body', async () => {
  const url = 'http://localhost:4321'
  const path = '/user'
  const expectedCode = 200
  nock(url).delete(path).reply(expectedCode)
  const fetchSpy = Sinon.spy(globalThis, 'fetch')
  const response = await sut.delete(`${url}${path}`)
  expect(fetchSpy.calledOnce).toBeTruthy()
  expect(fetchSpy.calledWith(`${url}${path}`)).toBeTruthy()
  expect(response.statusCode).toBe(expectedCode)
  expect(response.body).toBeFalsy()
})
