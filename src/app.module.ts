import { Logger, Module, OnApplicationBootstrap } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DbModule } from './db/db.module'
import { TasksModule } from './tasks/tasks.module'
import { TelegramModule } from './telegram/telegram.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TelegramModule,
    DbModule,
    TasksModule,
  ],
  providers: [],
})
export class AppModule implements OnApplicationBootstrap {
  private logger: Logger = new Logger('AppModule')

  async onApplicationBootstrap(): Promise<void> {
    this.logger.log('onApplicationBootstrap')
  }
}
