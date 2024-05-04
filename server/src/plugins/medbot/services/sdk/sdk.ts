import type { Telegraf } from 'telegraf';
import type { Logger } from 'pino';
import type { Prisma } from '@prisma/client';
import type { iMedbotContext } from '../../types.js';
import { oneTimeOrderCompleteMsg } from '../../scenes/chat/messages/oneTimeOrderComplete.js';
import { menuButton } from '../../buttons/menu.js';
import {
  APPOINTMENT_STATUS_MESSAGES,
  completeAppointmentByDoctorMsg,
  deleteAppointmentByDoctorMsg,
} from '../../scenes/chat/messages/appointmentStatus.js';
import { subscriptionOrderCompleteMsg } from '../../scenes/chat/messages/subscriptionOrderComplete.js';
import { capitalize } from '../../../../utils/string.js';

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

    this.completeSubscriptionOrder = this.completeSubscriptionOrder.bind(this);
    this.completeOneTimeOrder = this.completeOneTimeOrder.bind(this);
    this.completeAppointment = this.completeAppointment.bind(this);
    this.deleteAppointment = this.deleteAppointment.bind(this);
    this.sendAppointmentStatus = this.sendAppointmentStatus.bind(this);
    this.proceedToChat = this.proceedToChat.bind(this);
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

  public async createAppointment(
    botChatId: number,
    user: Prisma.UserUncheckedCreateInput,
    appointment: Prisma.AppointmentUncheckedCreateInput,
  ) {
    try {
      await this.telegram.sendMessage(
        botChatId,
        APPOINTMENT_STATUS_MESSAGES['/appointmentCreated']({
          appointment,
          user,
        }),
        {
          parse_mode: 'Markdown',
        },
      );
    } catch (e) {
      this.logger.error(e, 'medbotSdk:createAppointment');
    }
  }

  public async updateAppointment(
    botChatId: number,
    user: Prisma.UserUncheckedCreateInput,
    appointment: Prisma.AppointmentUncheckedCreateInput,
  ) {
    try {
      await this.telegram.sendMessage(
        botChatId,
        APPOINTMENT_STATUS_MESSAGES['/appointmentUpdated']({
          appointment,
          user,
        }),
        {
          parse_mode: 'Markdown',
        },
      );
    } catch (e) {
      this.logger.error(e, 'medbotSdk:updateAppointment');
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

  public async sendAppointmentStatus(tgQueryId: string, status: string) {
    try {
      await this.telegram.answerWebAppQuery(tgQueryId, {
        id: `${Math.random()}`,
        type: 'article',
        title: 'Оновлення статусу зустрічі',
        input_message_content: {
          message_text: `/appointment${capitalize(status)}`,
        },
      });
    } catch (e) {
      this.logger.error(e, 'medbotSdk:sendAppointmentStatus');
    }
  }

  public async proceedToChat(tgQueryId: string) {
    try {
      await this.telegram.answerWebAppQuery(tgQueryId, {
        id: '0',
        type: 'article',
        title: 'Дякуємо за замовлення!',
        input_message_content: {
          message_text: '/successfullOrder',
        },
      });
    } catch (e) {
      this.logger.error(e, 'medbotSdk:proceedToChat');
    }
  }
}
