import { Injectable } from '@nestjs/common'
import { InjectKnex, Knex } from 'nestjs-knex'

export interface TgUser {
  readonly id?: number
  // todo
  readonly created_at?: Date
  readonly updated_at?: Date
}

export interface TgUserRepositoryInterface {
  findAll(): Promise<TgUser[]>
  findById(id: number): Promise<TgUser | null>
  getById(id: number): Promise<TgUser>
  persist(entity: TgUser): Promise<TgUser>
}

@Injectable()
export class TgUserRepository implements TgUserRepositoryInterface {
  private readonly tableName: string = 'tg_users'

  constructor(
    @InjectKnex() private readonly knex: Knex,
  ) { }

  async findAll(): Promise<TgUser[]> {
    return this.knex
    .from<TgUser>(this.tableName)
    .select('*')
    .orderBy('id', 'desc')
    .returning('*')
  }

  async findById(id: number): Promise<TgUser | null> {
    const entity = await this.knex
      .from<TgUser>(this.tableName)
      .select('*')
      .where('id', id)
      .first()

    if (entity) {
      return entity
    }

    return null
  }

  async getById(id: number): Promise<TgUser> {
    const entity = await this.findById(id)
    if (entity === null) {
      throw new Error(`Cannot get entity ${id}`)
    }

    return entity
  }

  async persist(entity: TgUser): Promise<TgUser> {
    let result: TgUser[]
    if (entity.id !== undefined) {
      result = await this.knex
        .table<TgUser>(this.tableName)
        .where('id', entity.id)
        .returning('*')
        .update({
          ...entity,
          updated_at: new Date()
        })
    } else {
      result = await this.knex
        .table<TgUser>(this.tableName)
        .returning('*')
        .insert(entity)
    }

    if (result[0] === undefined) {
      throw new Error('Cannot save TgUser')
    }

    return result[0]
  }
}
