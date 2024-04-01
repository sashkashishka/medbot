import type { MiddlewareFn } from 'telegraf';
import type { iMedbotContext } from '../../../types.js';
import type { Update } from 'telegraf/types';
import { medbotLogger } from '../../../../../logger.js';

export const checkIfHasActiveOrder: MiddlewareFn<iMedbotContext> =
  async function checkIfHasActiveOrder(ctx, next) {
    const { session, serviceApiSdk } = ctx;

    try {
      const messageThreadId = (ctx.update as Update.MessageUpdate).message
        .message_thread_id;

      const [data, err] = await serviceApiSdk.getBotChatId(messageThreadId);

      if (err) {
        throw err;
      }

      ctx.session.botChatId = data.botChatId;
    } catch (e) {
      medbotLogger.error(e, 'checkIfHasActiveOrder');

      return ctx.reply('Error occured in checkIfHasActiveOrder middleware');;
    }

    return next();
  };
