import { Inject, Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { TgUserRepository } from '../db/repositories/tg-user.repository'

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name)

  constructor(
    @Inject(TgUserRepository)
    private readonly tgUserRepository: TgUserRepository,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async getTgUsers(): Promise<void> {
    const users = await this.tgUserRepository.findAll()

    for (const user of users) {
      this.logger.debug(`Tg user: ${user.id}`)
    }
  }
}
