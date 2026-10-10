import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('banks', (table: Knex.TableBuilder) => {
    table.increments('bank_id').primary()
    table.string('code', 10)
    table.string('name', 100)
    table.string('url', 255)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('banks')
}
