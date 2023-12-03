import type { Telegraf } from 'telegraf';
import { commandStart } from './start.js';
import { commandOrder } from './order.js';
// import { setMyCommands } from './setMyCommands.js';

export function commands(bot: Telegraf): void {
  commandStart(bot);
  commandOrder(bot);
  // setMyCommands(bot, { forum_chat_id: });
}
