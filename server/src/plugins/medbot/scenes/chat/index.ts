import { Scenes } from 'telegraf';
import { SCENES } from '../../constants/scenes.js';
import type { Update } from 'telegraf/types';
import type { iMedbotContext } from '../../types.js';
import { checkIfViaBot } from '../../middlewares/checkIfViaBot.js';
import { setMessageThreadId } from './middlewares/setMessageThreadId.js';
import { chatEnter } from './middlewares/chatEnter.js';
import { APPOINTMENT_STATUS_MESSAGES } from './messages/appointmentStatus.js';
import { createOrderChecker } from '../../middlewares/createOrderChecker.js';
import { teardownUserData } from './utils.js';

export const chatScene = new Scenes.BaseScene<iMedbotContext>(SCENES.CHAT);

chatScene.enter(chatEnter);

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
    const { update, serviceApiSdk } = ctx;

    try {
      const [activeAppointment, err] = await serviceApiSdk.activeAppointment(
        update.message.from.id,
      );

      if (err) {
        throw err;
      }

      const message =
        APPOINTMENT_STATUS_MESSAGES[update.message.text](activeAppointment);

      await Promise.all([
        ctx.deleteMessage(update.message.message_id),
        message ? ctx.reply(message) : Promise.resolve(),
      ]);
    } catch (e) {
      ctx.logger.error(e, 'chatScene--command--send-appointment-status');
    }
  },
);

chatScene.use(
  setMessageThreadId,
  // TODO: think about solution where order is saved
  // to session object
  // setOrderDetails,
  createOrderChecker(
    (ctx) => ({
      id: (ctx.update as Update.MessageUpdate).message.chat.id,
      idType: 'botChatId',
    }),
    [teardownUserData],
  ),
  async (ctx) => {
    try {
      await ctx.telegram.copyMessage(
        ctx.forumId,
        ctx.message.chat.id,
        ctx.message.message_id,
        { message_thread_id: ctx.session.messageThreadId },
      );
    } catch (e) {
      ctx.logger.error(e, 'chatScene');
    }
  },
);
