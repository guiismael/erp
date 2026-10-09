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
  expect(registerSpy.calledWith('get', '/banks', Sinon.match.func)).toBeTruthy()
  expect(
    registerSpy.calledWith('get', '/banks/:id', Sinon.match.func),
  ).toBeTruthy()
  expect(
    registerSpy.calledWith('post', '/banks', Sinon.match.func),
  ).toBeTruthy()
  expect(
    registerSpy.calledWith('put', '/banks/:id', Sinon.match.func),
  ).toBeTruthy()
  expect(
    registerSpy.calledWith('delete', '/banks/:id', Sinon.match.func),
  ).toBeTruthy()
})
