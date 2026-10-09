import { ApplicationError } from '@ApplicationError.ts'
import { DomainError } from '@DomainError.ts'
import { ErrorMapper } from '@ErrorMapper.ts'
import { NotFoundError } from '@NotFoundError.ts'

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
