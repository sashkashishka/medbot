import type { MiddlewareFn } from 'telegraf';
import type { iMedbotContext } from '../types.js';
import type { Update } from 'telegraf/types';
import { medbotLogger } from '../../../logger.js';

export const setBotChatId: MiddlewareFn<iMedbotContext> =
  async function setBotChatId(ctx, next) {
    const { session } = ctx;

    if (!session.botChatId) {
      try {
        const messageThreadId = (ctx.update as Update.MessageUpdate).message
          .message_thread_id;

        const user = await ctx.prisma.user.findFirst({
          where: { messageThreadId },
        });

        ctx.session.botChatId = user.botChatId;
      } catch (e) {
        medbotLogger.error(e, 'setBotChatId');
      }
    }

    return next();
  };
