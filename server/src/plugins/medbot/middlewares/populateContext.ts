import type { MiddlewareFn } from 'telegraf';
import type { iMedbotContext } from '../types.js';

export function populateContext({
  prisma,
  forumId,
}: Partial<iMedbotContext>): MiddlewareFn<iMedbotContext> {
  return function populateContextMiddleware(ctx, next) {
    ctx.prisma = prisma;
    ctx.forumId = forumId;

    return next();
  };
}
