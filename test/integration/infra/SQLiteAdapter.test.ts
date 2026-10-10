import { DatabaseConnection } from '@DatabaseConnection.ts'
import { SQLiteAdapter } from '@SQLiteAdapter.ts'

let sut: DatabaseConnection

beforeAll(() => {
  sut = new SQLiteAdapter(String(process.env.DATABASE_FILENAME))
})

afterAll(async () => {
  await sut.close()
})

test('should be able to make a query to database', async () => {
  const [row] = await sut.query(`SELECT 1 as result;`, [])
  expect(row.result).toBe(1)
})

test('should be able to use params on SQL', async () => {
  const param = 3
  const [row] = await sut.query(`SELECT ? as result;`, [param])
  expect(row.result).toBe(param)
})
