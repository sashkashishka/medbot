import { Scenes, Composer } from 'telegraf';
import { SCENES } from '../../constants/scenes.js';
import type { iMedbotContext } from '../../types.js';
import { MESSAGES } from './messages.js';

const webAppUrl = `${process.env.TG_BOT_WEBAPP_URL}/products`;

const orderHandler = new Composer<iMedbotContext>();

orderHandler.start(async (ctx) => {
  await Promise.all([
    ctx.reply(MESSAGES.ORDER),
    ctx.setChatMenuButton({
      text: 'Замовити',
      type: 'web_app',
      web_app: { url: webAppUrl },
    }),
  ]);
});

// TODO check if order created and with status active or check that command sent via bot
// and only after that proceed to next scene - set appointment
orderHandler.command('proceedToAppointment', async (ctx) => {
  const { update } = ctx;
  if (!update.message.via_bot) return;

  ctx.scene.enter(SCENES.APPOINTMENT);
});

export const orderScene = new Scenes.WizardScene<iMedbotContext>(
  SCENES.ORDER,
  orderHandler,
);
