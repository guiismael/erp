import { ExpectedError } from '@domain/errors/ExpectedError.ts'

export class ApplicationError extends ExpectedError {
  readonly code = 'APPLICATION_ERROR'
  constructor(message: string) {
    super(message)
  }
}
