import { ExpectedError } from '@ExpectedError.ts'

export class ApplicationError extends ExpectedError {
  readonly code = 'APPLICATION_ERROR'
  constructor(message: string) {
    super(message)
  }
}
