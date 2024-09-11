import { Module } from '@nestjs/common'
import { KnexModule } from 'nestjs-knex'
import config from '../../knexfile'
import { TgUserRepository } from './tg-user.repository'

@Module({
  imports: [
    KnexModule.forRoot({
      config,
    }),
  ],
  providers: [
    TgUserRepository,
  ],
  exports: [
    TgUserRepository,
  ],
})
export class DbModule {}
