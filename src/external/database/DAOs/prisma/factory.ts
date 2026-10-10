import { PrismaPg } from '@prisma/adapter-pg'

import { PrismaClient } from './generated/client.ts'

export async function prismaDatasourceFactory(databaseUrl: string) {
  const adapter = new PrismaPg(databaseUrl)
  const dataSource = new PrismaClient({
    adapter,
  })
  return dataSource
}
