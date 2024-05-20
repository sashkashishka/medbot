import { Scenes, Composer } from 'telegraf';
import { SCENES } from '../../constants/scenes.js';
import type { iMedbotContext } from '../../types.js';
import { setMyCommands } from '../../commands/setMyCommands.js';
import { entryMsg } from './messages/entry.js';
import { checkIfViaBot } from '../../middlewares/checkIfViaBot.js';
import { checkIfOrderIsPaid } from './middlewares/checkIfOrderIsPaid.js';
import { createForumTopic } from './middlewares/createForumTopic.js';
import { menuButton } from '../../buttons/menu.js';

const orderHandler = new Composer<iMedbotContext>();

orderHandler.start(setMyCommands, async (ctx) => {
  const { $t } = ctx;

  await Promise.all([
    ctx.reply(entryMsg($t), { parse_mode: 'Markdown' }),
    ctx.setChatMenuButton(menuButton.order(ctx.webAppUrl, $t)),
  ]);
});

orderHandler.command(
  'successfullOrder',
  checkIfViaBot,
  checkIfOrderIsPaid,
  createForumTopic,
);

export const orderScene = new Scenes.WizardScene<iMedbotContext>(
  SCENES.ORDER,
  orderHandler,
);
