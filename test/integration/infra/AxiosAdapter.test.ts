import { AxiosAdapter } from '@external/http/AxiosAdapter.ts'
import { HttpClient } from '@infra/http/HttpClient.ts'
import axios from 'axios'
import nock from 'nock'
import Sinon from 'sinon'

let sut: HttpClient

beforeAll(() => {
  sut = new AxiosAdapter()
})

afterEach(() => {
  Sinon.restore()
  nock.cleanAll()
})

test('should call axios get correctly and return correct data when request GET return 2xx', async () => {
  const url = 'http://localhost:4321'
  const path = '/user'
  const expectedCode = 200
  const expectedBody = {
    test: 'test',
  }
  nock(url).get(path).reply(expectedCode, expectedBody)
  const getSpy = Sinon.spy(axios, 'get')
  const response = await sut.get(`${url}${path}`)
  expect(getSpy.calledOnce).toBeTruthy()
  expect(getSpy.calledWith(`${url}${path}`)).toBeTruthy()
  expect(response.statusCode).toBe(expectedCode)
  expect(response.body.test).toBe(expectedBody.test)
})

test('should call axios get correctly and return correct data when request GET return 4xx', async () => {
  const url = 'http://localhost:4321'
  const path = '/user'
  const expectedCode = 400
  const expectedBody = {
    test: 'test',
  }
  nock(url).get(path).reply(expectedCode, expectedBody)
  const getSpy = Sinon.spy(axios, 'get')
  const response = await sut.get(`${url}${path}`)
  expect(getSpy.calledOnce).toBeTruthy()
  expect(getSpy.calledWith(`${url}${path}`)).toBeTruthy()
  expect(response.statusCode).toBe(expectedCode)
  expect(response.body.test).toBe(expectedBody.test)
})

test('should call axios get correctly and return correct data when request GET return 5xx', async () => {
  const url = 'http://localhost:4321'
  const path = '/user'
  const expectedCode = 500
  const expectedBody = {
    test: 'test',
  }
  nock(url).get(path).reply(expectedCode, expectedBody)
  const getSpy = Sinon.spy(axios, 'get')
  const response = await sut.get(`${url}${path}`)
  expect(getSpy.calledOnce).toBeTruthy()
  expect(getSpy.calledWith(`${url}${path}`)).toBeTruthy()
  expect(response.statusCode).toBe(expectedCode)
  expect(response.body.test).toBe(expectedBody.test)
})

test('should call axios post correctly and return correct data when request POST return 2xx', async () => {
  const url = 'http://localhost:4321'
  const path = '/user'
  const expectedCode = 201
  const expectedBody = {
    test: 'test',
  }
  nock(url).post(path).reply(expectedCode, expectedBody)
  const postSpy = Sinon.spy(axios, 'post')
  const response = await sut.post(`${url}${path}`, expectedBody)
  expect(postSpy.calledOnce).toBeTruthy()
  expect(
    postSpy.calledWith(`${url}${path}`, {
      test: expectedBody.test,
    }),
  ).toBeTruthy()
  expect(response.statusCode).toBe(expectedCode)
  expect(response.body.test).toBe(expectedBody.test)
})

test('should call axios put correctly and return correct data when request PUT return 2xx', async () => {
  const url = 'http://localhost:4321'
  const path = '/user'
  const expectedCode = 200
  const expectedBody = {
    test: 'test',
  }
  nock(url).put(path).reply(expectedCode, expectedBody)
  const putSpy = Sinon.spy(axios, 'put')
  const response = await sut.put(`${url}${path}`, expectedBody)
  expect(putSpy.calledOnce).toBeTruthy()
  expect(
    putSpy.calledWith(`${url}${path}`, {
      test: expectedBody.test,
    }),
  ).toBeTruthy()
  expect(response.statusCode).toBe(expectedCode)
  expect(response.body.test).toBe(expectedBody.test)
})

test('should call axios delete correctly and return correct data when request DELETE return 2xx', async () => {
  const url = 'http://localhost:4321'
  const path = '/user'
  const expectedCode = 200
  const expectedBody = {
    test: 'test',
  }
  nock(url).delete(path).reply(expectedCode, expectedBody)
  const deleteSpy = Sinon.spy(axios, 'delete')
  const response = await sut.delete(`${url}${path}`)
  expect(deleteSpy.calledOnce).toBeTruthy()
  expect(deleteSpy.calledWith(`${url}${path}`)).toBeTruthy()
  expect(response.statusCode).toBe(expectedCode)
  expect(response.body.test).toBe(expectedBody.test)
})

test('should return an empty body when the call return an empty body', async () => {
  const url = 'http://localhost:4321'
  const path = '/user'
  const expectedCode = 200
  nock(url).delete(path).reply(expectedCode)
  const deleteSpy = Sinon.spy(axios, 'delete')
  const response = await sut.delete(`${url}${path}`)
  expect(deleteSpy.calledOnce).toBeTruthy()
  expect(deleteSpy.calledWith(`${url}${path}`)).toBeTruthy()
  expect(response.statusCode).toBe(expectedCode)
  expect(response.body).toBeFalsy()
})
