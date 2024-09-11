import { Knex } from 'knex'

const TABLE_NAME = 'tg_users'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(TABLE_NAME, table => {
    table.increments()
    table.string('key')
    table.text('value').nullable()
    table.timestamps(false, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(TABLE_NAME)
}
