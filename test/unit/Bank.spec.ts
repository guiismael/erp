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
  instance.setCode('321')
  instance.setName('Other Name')
  instance.setUrl('other_url.com')
  expect(instance).toBeTruthy()
  expect(instance.getName()).toBe('Other Name')
  expect(instance.getCode()).toBe('321')
  expect(instance.getUrl()).toBe('other_url.com')
})
