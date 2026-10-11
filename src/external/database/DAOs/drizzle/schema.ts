import { integer, pgTable, varchar } from 'drizzle-orm/pg-core'

export const bankDrizzlePersistenceModel = pgTable('banks', {
  bankId: integer('bank_id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 100 }).notNull(),
  code: varchar('code', { length: 10 }).notNull(),
  url: varchar('url', { length: 255 }).notNull(),
})
