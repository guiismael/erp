import { validateBankCode } from '@domain/entities/validateBankCode.ts'

test.each([undefined, null, "''", 'Test', '1', '01', 'ABC'])(
  'should be able to return false if code %s be invalid',
  (invalidCode: any) => {
    const isValid = validateBankCode(invalidCode)
    expect(isValid).toBe(false)
  },
)

test('should be able to return true if code be valid', () => {
  const validCode = '123'
  const isValid = validateBankCode(validCode)
  expect(isValid).toBe(true)
})
