import { Scenes, Composer } from 'telegraf';
import { SCENES } from '../../constants/scenes.js';
import type { iMedbotContext } from '../../types.js';
import { entryMsg } from './messages/entry.js';
import { checkIfViaBot } from '../../middlewares/checkIfViaBot.js';
import { checkIfOrderIsPaid } from './middlewares/checkIfOrderIsPaid.js';
import { createForumTopic } from './middlewares/createForumTopic.js';
import { menuButton } from '../../buttons/menu.js';

const orderHandler = new Composer<iMedbotContext>();

orderHandler.start(async (ctx) => {
  await Promise.all([
    ctx.reply(entryMsg()),
    ctx.setChatMenuButton(menuButton.order(ctx.webAppUrl)),
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
