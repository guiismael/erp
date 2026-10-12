import { BankCode } from '@domain/entities/BankCode.ts'
import { DomainError } from '@domain/errors/DomainError.ts'

test.each([undefined, null, "''", 'Test', '1', '01', 'ABC'])(
  "should be able to return false if code '%s' be invalid",
  (invalidCode: any) => {
    expect(() => new BankCode(invalidCode)).toThrow(
      new DomainError('Invalid code.'),
    )
  },
)

test('should be able to return true if code be valid', () => {
  const validCode = '123'
  const instance = new BankCode(validCode)
  expect(instance).toBeTruthy()
  expect(instance.getValue()).toBe(validCode)
})
