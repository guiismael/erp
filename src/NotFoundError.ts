import { ExpectedError } from '@ExpectedError.ts'

export class NotFoundError extends ExpectedError {
  readonly code = 'NOT_FOUND_ERROR'
  constructor(message: string) {
    super(message)
  }
}
