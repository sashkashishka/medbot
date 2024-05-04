import { isBefore } from 'date-fns';
import type { MiddlewareFn } from 'telegraf';
import type { iMedbotContext } from '../types.js';

export function createCheckSubscription(
  fns: Array<(ctx: iMedbotContext) => Promise<iMedbotContext>>,
): MiddlewareFn<iMedbotContext> {
  return async function checkSubscription(ctx, next) {
    const { session } = ctx;
    const { order } = session;

    if (!order.subscriptionEndsAt) return next();

    try {
      if (isBefore(new Date(order.subscriptionEndsAt), new Date())) {
        return fns.reduce<Promise<iMedbotContext>>(
          (acc, fn) => acc.then(fn),
          Promise.resolve(ctx),
        );
      }
    } catch (e) {
      ctx.logger.error(e, 'checkSubscription');

      return ctx.reply('Error occured in checkSubscription middleware');
    }

    return next();
  };
}
