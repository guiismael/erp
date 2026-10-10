import { BankRepositorySQL } from '@BankRepository.ts'
import { BankRestController, HttpRestServer } from '@BankRestController.ts'
import { CreateBank } from '@CreateBank.ts'
import { FastifyAdapter } from '@FastifyAdapter.ts'
import { GetBankById } from '@GetBankById.ts'
import { GetBankList } from '@GetBankList.ts'
import { PostgreSQLAdapter } from '@PostgreSQLAdapter.ts'
import { RemoveBank } from '@RemoveBank.ts'
import { UpdateBank } from '@UpdateBank.ts'

// const databaseConnection = new MySQLAdapter(String(process.env.DATABASE_URL))
// const databaseConnection = new SQLiteAdapter(
//   String(process.env.DATABASE_FILENAME),
// )
const databaseConnection = new PostgreSQLAdapter(
  String(process.env.DATABASE_URL_PG),
)
const bankRepository = new BankRepositorySQL(databaseConnection)

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
