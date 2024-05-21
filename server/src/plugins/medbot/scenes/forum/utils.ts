import type { iMedbotContext } from '../../types.js';
import { orderNotActiveMsg } from './messages/orderNotActive.js';

export async function replyOrderNotActive(
  ctx: iMedbotContext,
): Promise<iMedbotContext> {
  ctx.reply(orderNotActiveMsg(ctx.$t), { parse_mode: 'Markdown' });
  return ctx;
}
