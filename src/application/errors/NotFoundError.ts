import { ExpectedError } from '@domain/errors/ExpectedError.ts'

export class NotFoundError extends ExpectedError {
  readonly code = 'NOT_FOUND_ERROR'
  constructor(message: string) {
    super(message)
  }
}
