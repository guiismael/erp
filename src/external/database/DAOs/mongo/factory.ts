import { MongoClient } from 'mongodb'

export async function mongoDatasourceFactory(databaseUrl: string) {
  const dataSource = new MongoClient(databaseUrl)
  await dataSource.connect()
  return dataSource
}
