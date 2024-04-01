import type { MiddlewareFn } from 'telegraf';
import type { iMedbotContext } from '../../../types.js';
import type { Update } from 'telegraf/types';

export const ignorePinnedMessage: MiddlewareFn<iMedbotContext> =
  async function ignorePinnedMessage(ctx, next) {
    const update = ctx.update as Update.MessageUpdate;

    if ('pinned_message' in update.message) {
      return;
    }

    return next();
  };
