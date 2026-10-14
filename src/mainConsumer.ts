import { RabbitMQueueAdapter } from '@external/queue/RabbitMQueueAdapter.ts'
import { BankEventQueueController } from '@infra/controllers/BankEventQueueController.ts'

const queue = new RabbitMQueueAdapter(String(process.env.RABBIT_URL))
await queue.connect()

new BankEventQueueController(queue)

let shuttingDown = false
const gracefulShutdown = async () => {
  if (shuttingDown) return
  shuttingDown = true
  try {
    await queue.disconnect()
    console.log('Application terminated.')
  } catch (error: any) {
    console.error(
      `Error on shutdown application: ${error.message}, stack: ${error.stack}`,
    )
  }
}

process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)
