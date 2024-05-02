import type { MiddlewareFn, NarrowedContext, Types } from 'telegraf';
import type { iMedbotContext } from '../types.js';
import { SCENES } from '../constants/scenes.js';

export const cleanupOnSecondStartCommand: MiddlewareFn<
  NarrowedContext<iMedbotContext, Types.MountMap['text']>
> = async function cleanupOnSecondStartCommand(ctx, next) {
  if (ctx.session?.__scenes?.current !== SCENES.ORDER) {
    ctx.session = {};

    const { update, serviceApiSdk } = ctx;

    try {
      const [_data, err] = await serviceApiSdk.teardownUserData(
        update.message.from.id,
      );

      if (err) {
        throw err;
      }
    } catch (e) {
      ctx.logger.error(e, 'cleanupOnSecondStartCommand');
    }
  }

  return next();
};
