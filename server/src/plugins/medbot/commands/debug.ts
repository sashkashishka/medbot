import type { iMedbotContext } from '../types.js';

export function debugCommand(ctx: iMedbotContext) {
  return ctx.reply(
    ctx.$t.get().debugInfo({
      userId: ctx.message.from.id,
      email: ctx.googleEmail,
    }),
    { parse_mode: 'Markdown' },
  );
}
