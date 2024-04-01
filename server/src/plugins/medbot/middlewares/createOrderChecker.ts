import type { MiddlewareFn } from 'telegraf';
import type { iMedbotContext } from '../types.js';

type tParamsGetter = (ctx: iMedbotContext) => {
  id: number;
  idType: Parameters<iMedbotContext['serviceApiSdk']['checkOrderActive']>[1];
};

export function createOrderChecker(
  getParams: tParamsGetter,
  fns: Array<(ctx: iMedbotContext) => Promise<iMedbotContext>>,
): MiddlewareFn<iMedbotContext> {
  return async function orderChecker(ctx, next) {
    const { serviceApiSdk } = ctx;

    try {
      const { id, idType } = getParams(ctx);

      const [data, err] = await serviceApiSdk.checkOrderActive(id, idType);

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
      ctx.logger.error(e, 'orderChecker');

      return ctx.reply('Error occured in checkIfHasActiveOrder middleware');
    }

    return next();
  };
}
