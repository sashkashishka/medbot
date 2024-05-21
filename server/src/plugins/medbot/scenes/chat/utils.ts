import type { Update } from 'telegraf/types';
import type { iMedbotContext } from '../../types.js';
import { menuButton } from '../../buttons/menu.js';

export async function teardownUserData(
  ctx: iMedbotContext,
): Promise<iMedbotContext> {
  try {
    const { update, serviceApiSdk, $t } = ctx;

    ctx.session = {};

    const userId = (update as Update.MessageUpdate).message.from.id;

    const [activeOrder, activeOrderErr] =
      await serviceApiSdk.activeOrder(userId);

    if (activeOrderErr) {
      throw activeOrderErr;
    }

    const [, teardownErr] = await serviceApiSdk.teardownUserData(userId);

    if (teardownErr) {
      throw teardownErr;
    }

    await Promise.all([
      ctx.telegram.sendMessage(
        (update as Update.MessageUpdate).message.from.id,
        activeOrder.subscriptionEndsAt
          ? $t.get().subscriptionOrderComplete
          : $t.get().oneTimeOrderComplete,
        { parse_mode: 'Markdown' },
      ),
      ctx.telegram.setChatMenuButton({
        chatId: (update as Update.MessageUpdate).message.chat.id,
        menuButton: menuButton.order(ctx.webAppUrl, $t),
      }),
    ]);
  } catch (e) {
    ctx.logger.error(e, 'createOrderChecker:teardownUserData');
  }

  return ctx;
}
