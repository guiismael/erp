import { CreateBank } from '@application/usecases/CreateBank.ts'
import { GetBankById } from '@application/usecases/GetBankById.ts'
import { GetBankList } from '@application/usecases/GetBankList.ts'
import { RemoveBank } from '@application/usecases/RemoveBank.ts'
import { UpdateBank } from '@application/usecases/UpdateBank.ts'
import { BankRestController } from '@infra/controllers/BankRestController.ts'
import { HttpRestServer } from '@infra/http/HttpRestServer.ts'
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
