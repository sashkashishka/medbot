import { Scenes, Composer, Markup } from 'telegraf';
import { SCENES } from '../../constants/scenes.js';
import type { iMedbotContext } from '../../types.js';
import { MESSAGES } from './messages.js';

const webAppUrl = process.env.TG_BOT_WEBAPP_URL;

const enterHandler = new Composer<iMedbotContext>();

enterHandler.start(async (ctx) => {
  await Promise.all([
    ctx.reply(
      MESSAGES.ENTRY,
      Markup.keyboard([Markup.button.webApp('Launch', webAppUrl)]).resize(),
    ),
    ctx.setChatMenuButton({
      text: 'Launch',
      type: 'web_app',
      web_app: { url: webAppUrl },
    }),
  ]);
});

export const enterScene = new Scenes.WizardScene<iMedbotContext>(
  SCENES.ENTER,
  enterHandler,
);
