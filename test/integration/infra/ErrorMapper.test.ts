import { ApplicationError } from '@application/errors/ApplicationError.ts'
import { NotFoundError } from '@application/errors/NotFoundError.ts'
import { DomainError } from '@domain/errors/DomainError.ts'
import { ErrorMapper } from '@infra/ErrorMapper.ts'

test('should return 404 on not found error', async () => {
  const error = new NotFoundError('Something is wrong.')
  const appResponse = await ErrorMapper.toRestResponse(error)
  expect(appResponse.statusCode).toBe(404)
  expect(appResponse.body.code).toBe('NOT_FOUND_ERROR')
  expect(appResponse.body.message).toBe('Something is wrong.')
})
test('should return 422 on domain error', async () => {
  const error = new DomainError('Something is wrong.')
  const appResponse = await ErrorMapper.toRestResponse(error)
  expect(appResponse.statusCode).toBe(422)
  expect(appResponse.body.code).toBe('DOMAIN_ERROR')
  expect(appResponse.body.message).toBe('Something is wrong.')
})
test('should return 422 on application error', async () => {
  const error = new ApplicationError('Something is wrong.')
  const appResponse = await ErrorMapper.toRestResponse(error)
  expect(appResponse.statusCode).toBe(422)
  expect(appResponse.body.code).toBe('APPLICATION_ERROR')
  expect(appResponse.body.message).toBe('Something is wrong.')
})
test('should return 500 on unexpected error', async () => {
  const error = new Error('Something is wrong.')
  const appResponse = await ErrorMapper.toRestResponse(error)
  expect(appResponse.statusCode).toBe(500)
  expect(appResponse.body.code).toBe('SERVER_ERROR')
  expect(appResponse.body.message).toBe('Internal server error.')
})
