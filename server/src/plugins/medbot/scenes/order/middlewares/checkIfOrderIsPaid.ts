import type { MiddlewareFn } from 'telegraf';
import type { iMedbotContext } from '../../../types.js';
import { orderNotPaidMsg } from '../messages/orderNotPaid.js';

export const checkIfOrderIsPaid: MiddlewareFn<iMedbotContext> =
  async function checkIfOrderIsPaid(ctx: iMedbotContext, next) {
    const { message, serviceApiSdk } = ctx;

    try {
      const [order, err] = await serviceApiSdk.activeOrder(message.from.id);

      if (err) {
        throw err;
      }

      if (!order) {
        return ctx.reply(orderNotPaidMsg());
      }

      return next();
    } catch (e) {
      ctx.logger.error(e, 'orderScene--check-if-order-paid');
    }
  };
