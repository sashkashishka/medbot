import type { MiddlewareFn } from 'telegraf';
import type { iMedbotContext } from '../../../types.js';
import type { Update } from 'telegraf/types';
import { medbotLogger } from '../../../../../logger.js';

/**
 * @note only for chat scene as we need to
 * retrieve userId from update obj
 */
export const setOrderDetails: MiddlewareFn<iMedbotContext> =
  async function setOrderDetails(ctx, next) {
    const { session, serviceApiSdk } = ctx;

    if (!session.order) {
      try {
        const userId = (ctx.update as Update.MessageUpdate).message.from.id;

        const [data, err] = await serviceApiSdk.activeOrder(userId);

        if (err) {
          throw err;
        }

        if (data) {
          ctx.session.order = {
            id: data?.id,
            subscriptionEndsAt: data?.subscriptionEndsAt,
          };
        }
      } catch (e) {
        medbotLogger.error(e, 'setOrderDetails');
      }
    }

    return next();
  };
