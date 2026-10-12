import { BankName } from '@domain/entities/BankName.ts'
import { DomainError } from '@domain/errors/DomainError.ts'

test.each([undefined, null, '', 'Test'])(
  "should be able to return false if name '%s' be invalid",
  (invalidName: any) => {
    expect(() => new BankName(invalidName)).toThrow(
      new DomainError('Invalid name.'),
    )
  },
)

test('should be able to return true if name be valid', () => {
  const validName = 'Bank Test'
  const instance = new BankName(validName)
  expect(instance).toBeTruthy()
  expect(instance.getValue()).toBe(validName)
})
