import { BankRestController, HttpRestServer } from '@BankRestController.ts'
import { CreateBank } from '@CreateBank.ts'
import { GetBankById } from '@GetBankById.ts'
import { GetBankList } from '@GetBankList.ts'
import { RemoveBank } from '@RemoveBank.ts'
import { UpdateBank } from '@UpdateBank.ts'
import Sinon from 'sinon'

const httpRestServer: HttpRestServer = {
  listen() {},
  register() {},
}

test('should be able to call httpRestServer correctly', () => {
  const registerSpy = Sinon.spy(httpRestServer, 'register')
  new BankRestController(
    httpRestServer,
    {} as GetBankList,
    {} as GetBankById,
    {} as CreateBank,
    {} as UpdateBank,
    {} as RemoveBank,
  )
  expect(registerSpy.called).toBeTruthy()
  expect(registerSpy.calledWith('GET', '/banks', Sinon.match.func)).toBeTruthy()
  expect(
    registerSpy.calledWith('GET', '/banks/:id', Sinon.match.func),
  ).toBeTruthy()
  expect(
    registerSpy.calledWith('POST', '/banks', Sinon.match.func),
  ).toBeTruthy()
  expect(
    registerSpy.calledWith('PUT', '/banks/:id', Sinon.match.func),
  ).toBeTruthy()
  expect(
    registerSpy.calledWith('DELETE', '/banks/:id', Sinon.match.func),
  ).toBeTruthy()
})
