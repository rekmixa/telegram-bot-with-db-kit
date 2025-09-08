import { Module } from '@nestjs/common'
import { DbModule } from 'src/db/db.module'
import { TelegramService } from './telegram.service'

@Module({
  imports: [DbModule],
  providers: [TelegramService],
  exports: [],
})
export class TelegramModule {}
