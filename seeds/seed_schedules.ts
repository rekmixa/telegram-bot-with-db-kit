import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  await knex('tg_users').insert([
    { id: 1 },
  ])
}
