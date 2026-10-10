import { validateBankName } from '@domain/entities/validateBankName.ts'

test.each([undefined, null, '', 'Test'])(
  "should be able to return false if name '%s' be invalid",
  (invalidName: any) => {
    const isValid = validateBankName(invalidName)
    expect(isValid).toBe(false)
  },
)

test('should be able to return true if name be valid', () => {
  const validName = 'Bank Test'
  const isValid = validateBankName(validName)
  expect(isValid).toBe(true)
})
