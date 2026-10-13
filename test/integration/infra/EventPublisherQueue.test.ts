import { EventPublisher } from '@application/EventPublisher.ts'
import { DomainEvent } from '@domain/events/DomainEvent.ts'
import { EventPublisherQueue } from '@infra/EventPublisherQueue.ts'
import { Queue } from '@infra/Queue.ts'
import Sinon from 'sinon'

let sut: EventPublisher
const queue: Queue = {
  async publish() {},
}

beforeAll(() => {
  sut = new EventPublisherQueue(queue)
})

afterEach(() => {
  Sinon.restore()
})

test('should be able to publish events correctly', async () => {
  const firstEvent: DomainEvent = {
    eventName: 'first_event',
    occurredAt: new Date(),
    payload: {
      aggregateId: 0,
    },
  }

  const secondEvent: DomainEvent = {
    eventName: 'second_event',
    occurredAt: new Date(),
    payload: {
      aggregateId: 1,
    },
  }
  const publishSpy = Sinon.spy(queue, 'publish')
  await sut.publishAll([firstEvent, secondEvent])
  expect(publishSpy.calledTwice).toBeTruthy()
  expect(
    publishSpy.calledWith(firstEvent.eventName, {
      ocurredAt: firstEvent.occurredAt,
      payload: firstEvent.payload,
    }),
  ).toBeTruthy()
  expect(
    publishSpy.calledWith(secondEvent.eventName, {
      ocurredAt: secondEvent.occurredAt,
      payload: secondEvent.payload,
    }),
  ).toBeTruthy()
})
