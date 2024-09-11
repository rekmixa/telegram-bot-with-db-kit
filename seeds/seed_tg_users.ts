import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  await knex('tg_users').insert([
    { id: 1, chat_id: 1, user_name: 'test', is_bot: false },
  ])
}
