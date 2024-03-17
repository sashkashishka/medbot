import { Scenes } from 'telegraf';
import { SCENES } from '../../constants/scenes.js';
import type { iMedbotContext } from '../../types.js';
import { setMessageThreadId } from '../../middlewares/setMessageThreadId.js';
import { MESSAGES } from './messages.js';
import { medbotLogger } from '../../../../logger.js';

export const chatScene = new Scenes.BaseScene<iMedbotContext>(SCENES.CHAT);

chatScene.enter(async (ctx) => {
  const webAppAppointmentUrl = `${ctx.webAppUrl}/appointment/list`;

  await Promise.all([
    ctx.reply(MESSAGES.APPOINTMENT),
    ctx.setChatMenuButton({
      text: 'Записатись',
      type: 'web_app',
      web_app: { url: webAppAppointmentUrl },
    }),
  ]);
});

const APPOINTMENT_COMMANDS = [
  'appointmentCreated',
  'appointmentUpdated',
  'appointmentDeleted',
];

chatScene.command(
  APPOINTMENT_COMMANDS,
  async (ctx, next) => {
    if (!ctx.update.message.via_bot) return undefined;

    return next();
  },
  async (ctx, next) => {
    const command = ctx.message.text.slice(1);

    if (!APPOINTMENT_COMMANDS.includes(command)) return undefined;

    return next();
  },
  async (ctx) => {
    const { update, serviceApiSdk } = ctx;

    try {
      const [activeAppointment, err] = await serviceApiSdk.activeAppointment(update.message.from.id);

      if (err) {
        throw err;
      }

      const message =
        MESSAGES.APPOINTMENT_STATUS[update.message.text](activeAppointment);

      await Promise.all([
        ctx.deleteMessage(update.message.message_id),
        message ? ctx.reply(message) : Promise.resolve(),
      ]);
    } catch (e) {
      medbotLogger.error(e, 'chatScene--command--send-appointment-status');
    }
  },
);

chatScene.use(setMessageThreadId);

chatScene.use(async (ctx) => {
  try {
    await ctx.telegram.copyMessage(
      ctx.forumId,
      ctx.message.chat.id,
      ctx.message.message_id,
      { message_thread_id: ctx.session.messageThreadId },
    );
  } catch (e) {
    medbotLogger.error(e, 'chatScene');
  }
});
