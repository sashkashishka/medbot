import type { MiddlewareFn } from 'telegraf';
import type { iMedbotContext } from '../types.js';
import type { Update } from 'telegraf/types';
import { medbotLogger } from '../../../logger.js';

export const setMessageThreadId: MiddlewareFn<iMedbotContext> =
  async function setMessageThreadId(ctx, next) {
    const { session, serviceApiSdk } = ctx;

    if (!session.messageThreadId) {
      try {
        const botChatId = (ctx.update as Update.MessageUpdate).message.chat.id;

        const [data, err] = await serviceApiSdk.getMessageThreadId(botChatId);

        if (err) {
          throw err;
        }

        ctx.session.messageThreadId = data.messageThreadId;
      } catch (e) {
        medbotLogger.error(e, 'setMessageThreadId');
      }
    }

    return next();
  };
