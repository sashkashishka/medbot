import type { MiddlewareFn } from 'telegraf';
import type { iMedbotContext } from '../types.js';

export const loggerMiddleware: MiddlewareFn<iMedbotContext> =
  async function loggerMiddleware(ctx, next) {
    const message = {
      update: ctx.update,
      session: ctx.session,
    };

    ctx.logger.info(message);

    return next();
  };
