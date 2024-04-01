import { Scenes, Composer } from 'telegraf';
import { SCENES } from '../../constants/scenes.js';
import type { iMedbotContext } from '../../types.js';
import { entryMsg } from './messages/entry.js';
import { checkIfViaBot } from '../../middlewares/checkIfViaBot.js';
import { checkIfOrderIsPaid } from './middlewares/checkIfOrderIsPaid.js';
import { createForumTopic } from './middlewares/createForumTopic.js';

const orderHandler = new Composer<iMedbotContext>();

orderHandler.start(async (ctx) => {
  const webAppOrderUrl = `${ctx.webAppUrl}/products`;

  await Promise.all([
    ctx.reply(entryMsg()),
    ctx.setChatMenuButton({
      text: 'Замовити',
      type: 'web_app',
      web_app: { url: webAppOrderUrl },
    }),
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
