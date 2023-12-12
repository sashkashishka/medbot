import type { MiddlewareFn } from 'telegraf';
import type { iMedbotContext } from '../types.js';
import { SCENES } from '../constants/scenes.js';
import { medbotLogger } from '../../../logger.js';

export const cleanupOnSecondStartCommand: MiddlewareFn<iMedbotContext> =
  async function cleanupOnSecondStartCommand(ctx, next) {
    if (ctx.session?.__scenes?.current !== SCENES.ORDER) {
      ctx.session = {};

      try {
        const order = await ctx.prisma.order.findFirst({
          where: { status: 'ACTIVE' },
        });

        if (order) {
          await ctx.prisma.order.update({
            where: { id: order?.id },
            data: { status: 'DONE' },
          });
        }
      } catch (e) {
        medbotLogger.error(e, 'cleanupOnSecondStartCommand');
      }
    }

    return next();
  };
