import { Scenes, Composer } from 'telegraf';
import { SCENES } from '../../constants/scenes.js';
import type { iMedbotContext } from '../../types.js';
import { MESSAGES } from './messages.js';

const webAppUrl = `${process.env.TG_BOT_WEBAPP_URL}/appointment`;

const appointmentHandler = new Composer<iMedbotContext>();

// TODO check if order created and with status active or check that command sent via bot
// and only after that proceed to next scene - set appointment
//
// TODO send message about setting appointment
// TODO set chat menu button with route to appointment form
appointmentHandler.command('proceedTo', async (ctx) => {
  console.log('$$$$$$$$$$$$$$$$$$$$');
  console.log('$$$$$$$$$$$$$$$$$$$$');
  console.log('$$$$$$$$$$$$$$$$$$$$');
  console.log(ctx.update);
});

export const appointmentScene = new Scenes.WizardScene<iMedbotContext>(
  SCENES.APPOINTMENT,
  async (ctx) => {
    await Promise.all([
      ctx.reply(MESSAGES.APPOINTMENT),
      ctx.setChatMenuButton({
        text: 'Appointment',
        type: 'web_app',
        web_app: { url: webAppUrl },
      }),
    ]);

    return ctx.wizard.next();
  },
  appointmentHandler,
);
