import type { MiddlewareFn } from 'telegraf';
import type { iMedbotContext } from '../types.js';

export const setMyCommands: MiddlewareFn<iMedbotContext> =
  async function setMyCommands(ctx, next) {
    const { $t } = ctx;

    await ctx.setMyCommands([
      {
        command: '/debug',
        description: $t.get().debugCommandDescription,
      },
    ]);

    return next();
  };
