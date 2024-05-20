import { Scenes } from 'telegraf';
import { SCENES } from '../../constants/scenes.js';
import type { iMedbotContext } from '../../types.js';
import { checkIfViaBot } from '../../middlewares/checkIfViaBot.js';
import { chatEnter } from './middlewares/chatEnter.js';
import { APPOINTMENT_STATUS_MESSAGES } from './messages/appointmentStatus.js';
import { teardownUserData } from './utils.js';
import { putOrderAndUserToSession } from './middlewares/putOrderAndUserToSession.js';
import { createCheckSubscription } from './middlewares/checkSubscription.js';

export const chatScene = new Scenes.BaseScene<iMedbotContext>(SCENES.CHAT);

chatScene.enter(putOrderAndUserToSession, chatEnter);

const APPOINTMENT_COMMANDS = [
  'appointmentCreated',
  'appointmentUpdated',
  'appointmentDeleted',
];

chatScene.command(
  APPOINTMENT_COMMANDS,
  checkIfViaBot,
  async (ctx, next) => {
    const command = ctx.message.text.slice(1);

    if (!APPOINTMENT_COMMANDS.includes(command)) return undefined;

    return next();
  },
  async (ctx) => {
    const { update, serviceApiSdk, session, $t } = ctx;
    const { user } = session;

    try {
      const [appointment, err] = await serviceApiSdk.activeAppointment(
        update.message.from.id,
      );

      if (err) {
        throw err;
      }

      const message = APPOINTMENT_STATUS_MESSAGES[update.message.text]({
        appointment,
        user,
        $t,
      });

      await Promise.all([
        ctx.deleteMessage(update.message.message_id),
        message
          ? ctx.reply(message, { parse_mode: 'Markdown' })
          : Promise.resolve(),
      ]);
    } catch (e) {
      ctx.logger.error(e, 'chatScene--command--send-appointment-status');
    }
  },
);

chatScene.use(createCheckSubscription([teardownUserData]), async (ctx) => {
  try {
    await ctx.telegram.copyMessage(
      ctx.forumId,
      ctx.message.chat.id,
      ctx.message.message_id,
      { message_thread_id: Number(ctx.session.user.messageThreadId) },
    );
  } catch (e) {
    ctx.logger.error(e, 'chatScene');
  }
});
