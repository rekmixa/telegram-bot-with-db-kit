import { Knex } from 'knex'

const TABLE_NAME = 'tg_users'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(TABLE_NAME, table => {
    table.increments()
    table.bigInteger('chat_id').unique()
    table.string('user_name').unique()
    table.string('first_name').nullable()
    table.boolean('is_bot')
    table.boolean('is_premium').nullable()
    table.string('language_code', 2).nullable()
    table.timestamps(false, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(TABLE_NAME)
}
