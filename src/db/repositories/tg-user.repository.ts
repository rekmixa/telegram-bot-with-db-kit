import { Injectable } from '@nestjs/common'
import { BaseRepository, Entity } from './base.repository'

export interface TgUser extends Entity {
  readonly chat_id: number
  user_name: string
  first_name: string | null
  readonly is_bot: boolean
  is_premium: boolean | null
  language_code: string | null
}

@Injectable()
export class TgUserRepository extends BaseRepository<TgUser> {
  protected tableName(): string {
    return 'tg_users'
  }

  async findByChatId(id: number): Promise<TgUser | null> {
    const entity = await this.table()
      .select('*')
      .where('chat_id', id)
      .first()

    if (entity) {
      return entity
    }

    return null
  }

  async getByChatId(id: number): Promise<TgUser> {
    const entity = await this.findByChatId(id)
    if (entity === null) {
      throw new Error(`Cannot get user by chatId ${id}`)
    }

    return entity
  }
}
