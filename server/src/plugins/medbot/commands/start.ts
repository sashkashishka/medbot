import type { Telegraf } from 'telegraf';

export function commandStart(bot: Telegraf): void {
  bot.command('start', async (ctx) => {
    await ctx.telegram.sendMessage(
      ctx.message.chat.id,
      `Hello ${ctx.state.role}`,
    );
  });
}
