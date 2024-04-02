import type { Telegraf } from 'telegraf';
import type { Logger } from 'pino';
import type { Prisma } from '@prisma/client';
import type { iMedbotContext } from '../../types.js';
import { oneTimeOrderClosedMsg } from '../../scenes/chat/messages/oneTimeOrderClosed.js';
import { menuButton } from '../../buttons/menu.js';
import {
  completeAppointmentByDoctorMsg,
  deleteAppointmentByDoctorMsg,
} from '../../scenes/chat/messages/appointmentStatus.js';

interface iOptions {
  telegram: Telegraf<iMedbotContext>['telegram'];
  webAppUrl: string;
  logger: Logger;
}

export class MedbotSdk {
  private telegram: iOptions['telegram'];

  private webAppUrl: iOptions['webAppUrl'];

  private logger: iOptions['logger'];

  constructor({ telegram, webAppUrl, logger }: iOptions) {
    this.telegram = telegram;
    this.webAppUrl = webAppUrl;
    this.logger = logger;
  }

  public async closeOneTimeOrder(botChatId: number) {
    try {
      await this.telegram.sendMessage(botChatId, oneTimeOrderClosedMsg(), {
        parse_mode: 'Markdown',
      });
      await this.telegram.setChatMenuButton({
        chatId: botChatId,
        menuButton: menuButton.order(this.webAppUrl),
      });
    } catch (e) {
      this.logger.error(e, 'medbotSdk:closeOneTimeOrder');
    }
  }

  public async completeAppointment(
    botChatId: number,
    order: Prisma.OrderUncheckedCreateInput,
  ) {
    await this.telegram.sendMessage(
      botChatId,
      completeAppointmentByDoctorMsg(order),
      {
        parse_mode: 'Markdown',
      },
    );
  }

  public async deleteAppointment(botChatId: number) {
    await this.telegram.sendMessage(botChatId, deleteAppointmentByDoctorMsg(), {
      parse_mode: 'Markdown',
    });
  }
}
