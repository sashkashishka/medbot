import type { MiddlewareFn } from 'telegraf';
import type { iMedbotContext } from '../../../types.js';
import type { Update } from 'telegraf/types';

export const ignoreGeneralTopicUpdates: MiddlewareFn<iMedbotContext> =
  async function ignoreGeneralTopicUpdates(ctx, next) {
    const update = ctx.update as Update.MessageUpdate;

    if (!update.message.message_thread_id) {
      return;
    }

    return next();
  };
