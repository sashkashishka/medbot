import type { MiddlewareFn } from 'telegraf';
import type { Update } from 'telegraf/types';
import type { iMedbotContext } from '../../../types.js';

export const putOrderAndUserToSession: MiddlewareFn<iMedbotContext> =
  async function putOrderAndUserToSession(ctx) {
    const { serviceApiSdk } = ctx;

    const userId = (ctx.update as Update.MessageUpdate).message.from.id;

    try {
      const [user, userErr] = await serviceApiSdk.user(userId);

      if (userErr) {
        throw userErr;
      }

      const [order, orderErr] = await serviceApiSdk.activeOrder(userId);

      if (orderErr) {
        throw orderErr;
      }

      ctx.session.user = user;
      ctx.session.order = order;
    } catch (e) {
      ctx.logger.error(e, 'putOrderAndUserToSession');
    }
  };
