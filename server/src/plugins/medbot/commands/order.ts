import type { Telegraf } from 'telegraf';
import { Stage } from 'telegraf/scenes';
import { SCENES } from '../constants/scenes.js';

export function commandOrder(bot: Telegraf): void {
  bot.command('order', Stage.enter(SCENES.ENTER));
}
