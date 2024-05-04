import type { MiddlewareFn } from 'telegraf';
import type { iMedbotContext } from '../../../types.js';
import type { Update } from 'telegraf/types';

export function createCheckOrderActive(
  fns: Array<(ctx: iMedbotContext) => Promise<iMedbotContext>>,
): MiddlewareFn<iMedbotContext> {
  return async function checkOrderActive(ctx, next) {
    const { serviceApiSdk } = ctx;

    try {
      const messageThreadId = (ctx.update as Update.MessageUpdate).message
        .message_thread_id;

      const [data, err] = await serviceApiSdk.checkOrderActive(
        messageThreadId,
        'messageThreadId',
      );

      if (err) {
        throw err;
      }

      if (!data.active) {
        return fns.reduce<Promise<iMedbotContext>>(
          (acc, fn) => acc.then(fn),
          Promise.resolve(ctx),
        );
      }
    } catch (e) {
      ctx.logger.error(e, 'checkOrderActive');

      return ctx.reply('Error occured in checkOrderActive middleware');
    }

    return next();
  };
}
