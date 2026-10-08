import { Bank } from '@Bank.ts'

test('should be able to create a bank', () => {
  const instance = Bank.create({
    name: 'Any Name',
    code: '123',
    url: 'url.com',
  })
  expect(instance).toBeTruthy()
  expect(instance.getBankId()).toBeDefined()
  expect(instance.getName()).toBe('Any Name')
  expect(instance.getCode()).toBe('123')
  expect(instance.getUrl()).toBe('url.com')
})

test('should be able to restore a bank', () => {
  const instance = Bank.restore({
    bankId: 1,
    name: 'Any Name',
    code: '123',
    url: 'url.com',
  })
  expect(instance).toBeTruthy()
  expect(instance.getBankId()).toBe(1)
  expect(instance.getName()).toBe('Any Name')
  expect(instance.getCode()).toBe('123')
  expect(instance.getUrl()).toBe('url.com')
})

test('should be able to update bank properties', () => {
  const instance = Bank.restore({
    bankId: 1,
    name: 'Any Name',
    code: '123',
    url: 'url.com',
  })
  instance.changeCode('321')
  instance.changeName('Other Name')
  instance.setUrl('other_url.com')
  expect(instance).toBeTruthy()
  expect(instance.getName()).toBe('Other Name')
  expect(instance.getCode()).toBe('321')
  expect(instance.getUrl()).toBe('other_url.com')
})

test('should not be able to create a bank with invalid name', () => {
  const invalidName = 'abc'
  expect(() =>
    Bank.create({
      name: invalidName,
      code: '123',
      url: 'url',
    }),
  ).toThrow('Invalid name.')
})

test('should not be able to create a bank with invalid code', () => {
  const invalidCode = 'abc'
  expect(() =>
    Bank.create({
      name: 'Test Bank',
      code: invalidCode,
      url: 'url',
    }),
  ).toThrow('Invalid code.')
})

test('should not be able to change name with invalid name', () => {
  const instance = Bank.create({
    code: '123',
    name: 'Test Name',
    url: 'any_url.com',
  })
  const invalidName = 'abc'
  expect(() => instance.changeName(invalidName)).toThrow('Invalid name.')
})

test('should not be able to change code with invalid code', () => {
  const instance = Bank.create({
    code: '123',
    name: 'Test Name',
    url: 'any_url.com',
  })
  const invalidCode = 'abc'
  expect(() => instance.changeCode(invalidCode)).toThrow('Invalid code.')
})
