import { CreateBank } from '@application/usecases/CreateBank.ts'
import { GetBankById } from '@application/usecases/GetBankById.ts'
import { GetBankList } from '@application/usecases/GetBankList.ts'
import { RemoveBank } from '@application/usecases/RemoveBank.ts'
import { UpdateBank } from '@application/usecases/UpdateBank.ts'
import { PostgreSQLAdapter } from '@external/database/PostgreSQLAdapter.ts'
import { FastifyAdapter } from '@external/http/FastifyAdapter.ts'
import { BankRestController } from '@infra/controllers/BankRestController.ts'
import { BankDAOSQL } from '@infra/database/DAOs/BankDAOSQL.ts'
import { BankRepositoryDatabase } from '@infra/database/repositories/BankRepositoryDatabase.ts'
import { HttpRestServer } from '@infra/http/HttpRestServer.ts'

// const databaseConnection = new MySQLAdapter(String(process.env.DATABASE_URL))
const databaseConnection = new PostgreSQLAdapter(
  String(process.env.DATABASE_URL_PG),
)
// const databaseConnection = new SQLiteAdapter(
//   String(process.env.DATABASE_FILENAME),
// )
const bankDao = new BankDAOSQL(databaseConnection)
// const bankRepository = new BankRepositorySQL(databaseConnection)
const bankRepository = new BankRepositoryDatabase(bankDao)

// const httpRestServer: HttpRestServer = new ExpressAdapter()
const httpRestServer: HttpRestServer = new FastifyAdapter()
const getBankList = new GetBankList(bankRepository)
const getBankById = new GetBankById(bankRepository)
const createBank = new CreateBank(bankRepository)
const updateBank = new UpdateBank(bankRepository)
const removeBank = new RemoveBank(bankRepository)
new BankRestController(
  httpRestServer,
  getBankList,
  getBankById,
  createBank,
  updateBank,
  removeBank,
)
httpRestServer.listen(3000)

const gracefulShutdown = async () => {
  try {
    await databaseConnection.close()
    console.log('Application terminated.')
  } catch (error: any) {
    console.error(
      `Error on shutdown application: ${error.message}, stack: ${error.stack}`,
    )
  }
}

process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)
