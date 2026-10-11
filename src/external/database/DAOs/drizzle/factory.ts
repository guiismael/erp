import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

export async function drizzleDatasourceFactory(databaseUrl: string) {
  const pool = new Pool({
    connectionString: databaseUrl,
  })
  const dataSource = drizzle({
    client: pool,
  })
  return dataSource
}
