import type { MiddlewareFn } from 'telegraf';
import type { iMedbotContext } from '../types.js';
import type { Update } from 'telegraf/types';
import { medbotLogger } from '../../../logger.js';

export const setMessageThreadId: MiddlewareFn<iMedbotContext> =
  async function setMessageThreadId(ctx, next) {
    const { session } = ctx;

    if (!session.messageThreadId) {
      try {
        const botChatId = (ctx.update as Update.MessageUpdate).message.chat.id;

        const user = await ctx.prisma.user.findUnique({
          where: { id: botChatId },
        });

        ctx.session.messageThreadId = user.messageThreadId;
      } catch (e) {
        medbotLogger.error(e, 'setMessageThreadId');
      }
    }

    return next();
  };
