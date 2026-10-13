import { MediatorQueueAdapter } from '@external/queue/MediatorQueueAdapter.ts'
import Sinon from 'sinon'

let sut: MediatorQueueAdapter

beforeAll(() => {
  sut = new MediatorQueueAdapter()
})

afterEach(() => {
  Sinon.restore()
})

test('should save handlers on register consumer', async () => {
  const callbackDummy = () => {}
  const eventDummy = 'any_name'
  await sut.consume(eventDummy, callbackDummy)
  await sut.consume(eventDummy, callbackDummy)
  expect(sut.handlers).toHaveLength(2)
  const [first] = sut.handlers
  expect(first.key).toBe(eventDummy)
  expect(first.callback).toBeInstanceOf(Function)
})

test('should call handlers on publish', async () => {
  const callbackSpy = Sinon.spy()
  const eventDummy = 'any_name'
  await sut.consume(eventDummy, callbackSpy)
  await sut.consume(eventDummy, callbackSpy)
  await sut.consume('other_name', callbackSpy)
  const payloadDummy = 'payload'
  await sut.publish(eventDummy, payloadDummy)
  expect(callbackSpy.calledTwice).toBeTruthy()
  expect(callbackSpy.calledWith(payloadDummy)).toBeTruthy()
})
