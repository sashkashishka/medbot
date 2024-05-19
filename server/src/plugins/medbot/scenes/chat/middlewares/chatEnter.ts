import type { MiddlewareFn } from 'telegraf';
import type { iMedbotContext } from '../../../types.js';
import type { Update } from 'telegraf/types';
import { entryMsg } from '../messages/entry.js';
import { menuButton } from '../../../buttons/menu.js';

export const chatEnter: MiddlewareFn<iMedbotContext> = async function chatEnter(
  ctx,
) {
  const { serviceApiSdk } = ctx;

  const botChatId = (ctx.update as Update.MessageUpdate).message.chat.id;
  const userId = (ctx.update as Update.MessageUpdate).message.from.id;

  const [[product, productErr], [activeOrder, activeOrderErr]] =
    await Promise.all([
      serviceApiSdk.getActiveOrdersProduct(botChatId, 'botChatId'),
      serviceApiSdk.activeOrder(userId),
    ]);

  if (productErr || activeOrderErr) {
    ctx.logger.error(
      { productErr, activeOrderErr },
      'chatEnter: getActiveOrdersProduct or activeOrder',
    );
  }

  await Promise.all([
    ctx.reply(
      entryMsg({
        product,
        activationCodes: (activeOrder?.activationCode as number[]) || [],
      }),
      { parse_mode: 'Markdown' },
    ),
    ctx.setChatMenuButton(menuButton.appointment(ctx.webAppUrl, ctx.$t)),
  ]);
};
