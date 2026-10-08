import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('banks', (table: Knex.TableBuilder) => {
    table.index('code')
    table.index('name')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('banks', (table: Knex.TableBuilder) => {
    table.dropIndex('code')
    table.dropIndex('name')
  })
}
