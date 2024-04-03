import type { Telegraf } from 'telegraf';
import type { Logger } from 'pino';
import type { Prisma } from '@prisma/client';
import type { iMedbotContext } from '../../types.js';
import { oneTimeOrderCompleteMsg } from '../../scenes/chat/messages/oneTimeOrderComplete.js';
import { menuButton } from '../../buttons/menu.js';
import {
  completeAppointmentByDoctorMsg,
  deleteAppointmentByDoctorMsg,
} from '../../scenes/chat/messages/appointmentStatus.js';
import { subscriptionOrderCompleteMsg } from '../../scenes/chat/messages/subscriptionOrderComplete.js';

export interface iMedbotSdkOptions {
  telegram: Telegraf<iMedbotContext>['telegram'];
  webAppUrl: string;
  logger: Logger;
}

export class MedbotSdk {
  private telegram: iMedbotSdkOptions['telegram'];

  private webAppUrl: iMedbotSdkOptions['webAppUrl'];

  private logger: iMedbotSdkOptions['logger'];

  constructor({ telegram, webAppUrl, logger }: iMedbotSdkOptions) {
    this.telegram = telegram;
    this.webAppUrl = webAppUrl;
    this.logger = logger;
  }

  public async completeSubscriptionOrder(botChatId: number) {
    try {
      await this.telegram.sendMessage(
        botChatId,
        subscriptionOrderCompleteMsg(),
        {
          parse_mode: 'Markdown',
        },
      );
      await this.telegram.setChatMenuButton({
        chatId: botChatId,
        menuButton: menuButton.order(this.webAppUrl),
      });
    } catch (e) {
      this.logger.error(e, 'medbotSdk:completeSubscriptionOrder');
    }
  }

  public async completeOneTimeOrder(botChatId: number) {
    try {
      await this.telegram.sendMessage(botChatId, oneTimeOrderCompleteMsg(), {
        parse_mode: 'Markdown',
      });
      await this.telegram.setChatMenuButton({
        chatId: botChatId,
        menuButton: menuButton.order(this.webAppUrl),
      });
    } catch (e) {
      this.logger.error(e, 'medbotSdk:completeOneTimeOrder');
    }
  }

  public async completeAppointment(
    botChatId: number,
    order: Prisma.OrderUncheckedCreateInput,
  ) {
    try {
      await this.telegram.sendMessage(
        botChatId,
        completeAppointmentByDoctorMsg(order),
        {
          parse_mode: 'Markdown',
        },
      );
    } catch (e) {
      this.logger.error(e, 'medbotSdk:completeAppointment');
    }
  }

  public async deleteAppointment(botChatId: number) {
    try {
      await this.telegram.sendMessage(
        botChatId,
        deleteAppointmentByDoctorMsg(),
        {
          parse_mode: 'Markdown',
        },
      );
    } catch (e) {
      this.logger.error(e, 'medbotSdk:deleteAppointment');
    }
  }
}
