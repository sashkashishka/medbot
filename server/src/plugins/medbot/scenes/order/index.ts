import { Scenes, Composer } from 'telegraf';
import { SCENES } from '../../constants/scenes.js';
import type { iMedbotContext } from '../../types.js';
import { MESSAGES } from './messages.js';
import { medbotLogger } from '../../../../logger.js';

const webAppUrl = `${process.env.TG_BOT_WEBAPP_URL}/products`;

const orderHandler = new Composer<iMedbotContext>();

orderHandler.start(async (ctx) => {
  await Promise.all([
    ctx.reply(MESSAGES.ORDER),
    ctx.setChatMenuButton({
      text: 'Замовити',
      type: 'web_app',
      web_app: { url: webAppUrl },
    }),
  ]);
});

orderHandler.command(
  'successfull-order',
  async (ctx, next) => {
    if (!ctx.update.message.via_bot) return undefined;

    return next();
  },
  async (ctx, next) => {
    const { prisma, message } = ctx;

    try {
      const order = await prisma.order.findFirst({
        where: {
          userId: message.from.id,
          status: 'ACTIVE',
        },
      });

      if (!order) {
        return ctx.reply(MESSAGES.ERROR.ORDER_NOT_PAID);
      }

      return next();
    } catch (e) {
      medbotLogger.error(e, 'orderScene--check-if-order-paid');
    }
  },
  async (ctx) => {
    const { update, prisma, telegram, forumId, message, scene } = ctx;

    try {
      const userId = update.message.from.id;
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user.messageThreadId) {
        const forumTopic = await telegram.createForumTopic(
          forumId,
          `${message.from.id}: ${user.surname} ${user.name} ${
            user.patronymic ?? ''
          }`.trim(),
        );

        await prisma.user.update({
          where: { id: userId },
          data: {
            messageThreadId: forumTopic.message_thread_id,
            botChatId: message.chat.id,
          },
        });
      }

      return scene.enter(SCENES.CHAT);
    } catch (e) {
      medbotLogger.error(e, 'appointmentScene');
      return undefined;
    }
  },
);

export const orderScene = new Scenes.WizardScene<iMedbotContext>(
  SCENES.ORDER,
  orderHandler,
);
