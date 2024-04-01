import { Scenes, Composer } from 'telegraf';
import { SCENES } from '../../constants/scenes.js';
import type { iMedbotContext } from '../../types.js';
import { medbotLogger } from '../../../../logger.js';
import { entryMessage } from './messages/entry.js';
import { orderNotPaid } from './messages/orderNotPaid.js';

const orderHandler = new Composer<iMedbotContext>();

orderHandler.start(async (ctx) => {
  const webAppOrderUrl = `${ctx.webAppUrl}/products`;

  await Promise.all([
    ctx.reply(entryMessage()),
    ctx.setChatMenuButton({
      text: 'Замовити',
      type: 'web_app',
      web_app: { url: webAppOrderUrl },
    }),
  ]);
});

orderHandler.command(
  'successfullOrder',
  async (ctx, next) => {
    if (!ctx.update.message.via_bot) return undefined;

    return next();
  },
  async (ctx, next) => {
    const { message, serviceApiSdk } = ctx;

    try {
      const [order, err] = await serviceApiSdk.activeOrder(message.from.id);

      if (err) {
        throw err;
      }

      if (!order) {
        return ctx.reply(orderNotPaid());
      }

      return next();
    } catch (e) {
      medbotLogger.error(e, 'orderScene--check-if-order-paid');
    }
  },
  async (ctx) => {
    const { update, serviceApiSdk, telegram, forumId, message, scene } = ctx;

    try {
      const userId = update.message.from.id;

      const [user, err] = await serviceApiSdk.user(userId);

      if (err) {
        throw err;
      }

      if (!user.messageThreadId) {
        const forumTopic = await telegram.createForumTopic(
          forumId,
          `${message.from.id}: ${user.surname} ${user.name} ${
            user.patronymic ?? ''
          }`.trim(),
        );

        const [_data, err] = await serviceApiSdk.updateUser(userId, {
          ...user,
          messageThreadId: forumTopic.message_thread_id,
          botChatId: message.chat.id,
        });

        if (err) {
          throw err;
        }
      }

      await ctx.deleteMessage(update.message.message_id);

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
