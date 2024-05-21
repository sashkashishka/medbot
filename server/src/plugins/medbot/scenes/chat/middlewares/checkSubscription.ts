import { isBefore } from 'date-fns';
import type { MiddlewareFn } from 'telegraf';
import type { iMedbotContext } from '../../../types.js';

export function createCheckSubscription(
  fns: Array<(ctx: iMedbotContext) => Promise<iMedbotContext>>,
): MiddlewareFn<iMedbotContext> {
  return async function checkSubscription(ctx, next) {
    const { $t, session } = ctx;
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

      return ctx.reply($t.get().checkSubscriptionMiddlewareError, {
        parse_mode: 'Markdown',
      });
    }

    return next();
  };
}
