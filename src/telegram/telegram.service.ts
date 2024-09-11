import { Inject, Injectable, Logger } from '@nestjs/common'
import * as TelegramBot from 'node-telegram-bot-api'
import { TgUserRepository } from 'src/db/repositories/tg-user.repository'

@Injectable()
export class TelegramService {
  private readonly logger: Logger = new Logger('TelegramService')
  private readonly bot: TelegramBot

  constructor(
    @Inject(TgUserRepository)
    private readonly tgUserRepository: TgUserRepository,
  ) {
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true })
  }

  async onModuleInit(): Promise<void> {
    this.bot.setMyCommands([
      {
        command: 'start',
        description: 'Запуск',
      },
      {
        command: 'ping',
        description: 'Пинг',
      },
    ])

    this.bot.on('callback_query', async data => {
      try {
        if (data.data === 'ping') {
          console.log(data)

          await this.bot.answerCallbackQuery(data.id, {
            text: 'pong',
          })
        }
      } catch (error) {
        this.logger.debug(error)
      }
    })

    this.bot.on('message', async message => {
      this.handleMessage(message)
    })
  }

  private async handleMessage(message: any): Promise<void> {
    console.log(message)

    if (!message?.text) {
      return
    }

    try {
      await this.setTyping(message.chat.id)

      if (message.text === '/start') {
        await this.reply(message.chat.id, 'start')

        let tgUser = await this.tgUserRepository.findByChatId(message.from.id)
        if (tgUser === null) {
          tgUser = {
            chat_id: message.from.id,
            user_name: null,
            first_name: null,
            is_bot: message.from.is_bot,
            is_premium: null,
            language_code: null,
          }
        }

        tgUser.user_name = message.from.username
        tgUser.first_name = message.from.first_name
        tgUser.is_premium = message.from.is_premium
        tgUser.language_code = message.from.language_code
        
        console.log(tgUser)
        const savedUser = await this.tgUserRepository.persist(tgUser)
        this.logger.debug(`Saved user ${savedUser.id}`)
      }

      if (message.text === '/ping') {
        await this.reply(message.chat.id, 'pong', {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: 'ping ',
                  callback_data: 'ping',
                }
              ],
            ],
          }
        })
      }
    } catch (error) {
      this.logger.debug(error)

      try {
        await this.reply(message.chat.id, 'Что-то пошло не так...', {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: 'Попробовать снова',
                  callback_data: 'retry',
                }
              ],
            ],
          }
        })
      } catch (error) {
        this.logger.debug(error)
      }
    }
  }

  private async setTyping(chatId): Promise<void> {
    this.logger.log(`Typing started for: ${chatId}`)
    await this.bot.sendChatAction(chatId, 'typing')
  }

  private async reply(chatId: string, text: string, options?: any): Promise<void> {
    await this.bot.sendMessage(chatId, text, options)
  }
}
