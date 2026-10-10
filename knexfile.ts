import type { Knex } from 'knex'

export default {
  client: 'pg',
  connection: String(process.env.DATABASE_URL_PG),
  migrations: {
    directory: './src/external/database/migrations',
  },
} satisfies Knex.Config
