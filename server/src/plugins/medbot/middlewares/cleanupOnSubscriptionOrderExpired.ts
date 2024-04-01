import { isPast } from 'date-fns';
import type { MiddlewareFn, NarrowedContext, Types } from 'telegraf';
import type { iMedbotContext } from '../types.js';

export const cleanupOnSubscriptionOrderExpired: MiddlewareFn<
  NarrowedContext<iMedbotContext, Types.MountMap['text']>
> = async function cleanupOnSubscriptionOrderExpired(ctx, next) {
  const { session } = ctx;

  if (
    session?.order?.subscriptionEndsAt &&
    isPast(session?.order?.subscriptionEndsAt)
  ) {
    ctx.session = {};

    const { update, serviceApiSdk } = ctx;

    try {
      const [, err] = await serviceApiSdk.teardownUserData(
        update.message.from.id,
      );

      // TODO:
      // send message that order is closed
      // set order button
      // and return

      if (err) {
        throw err;
      }
    } catch (e) {
      ctx.logger.error(e, 'cleanupOnSubscriptionOrderExpired');
    }
  }

  return next();
};
