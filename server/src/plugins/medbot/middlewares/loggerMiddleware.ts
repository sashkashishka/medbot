import type { MiddlewareFn } from 'telegraf';
import type { iMedbotContext } from '../types.js';
import { medbotLogger } from '../../../logger.js';

export const loggerMiddleware: MiddlewareFn<iMedbotContext> =
  async function loggerMiddleware(ctx, next) {
    const message = {
      update: ctx.update,
      session: ctx.session,
    };

    medbotLogger.info(message);

    return next();
  };
