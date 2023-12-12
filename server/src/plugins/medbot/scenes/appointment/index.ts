import { Scenes } from 'telegraf';
import { SCENES } from '../../constants/scenes.js';
import type { iMedbotContext } from '../../types.js';
import { MESSAGES } from './messages.js';
import { medbotLogger } from '../../../../logger.js';

const webAppUrl = `${process.env.TG_BOT_WEBAPP_URL}/appointment`;

export const appointmentScene = new Scenes.BaseScene<iMedbotContext>(
  SCENES.APPOINTMENT,
);

appointmentScene.enter(async (ctx) => {
  await Promise.all([
    ctx.reply(MESSAGES.APPOINTMENT),
    ctx.setChatMenuButton({
      text: 'Appointment',
      type: 'web_app',
      web_app: { url: webAppUrl },
    }),
  ]);
});

appointmentScene.command('proceedToChat', async (ctx) => {
  // TODO check if appointment created
  // const { update } = ctx;
  // if (!update.message.via_bot) return;

  try {
    const userId = ctx.update.message.from.id;
    const user = await ctx.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user.messageThreadId) {
      const forumTopic = await ctx.telegram.createForumTopic(
        ctx.forumId,
        `User: ${ctx.message.from.id}`,
      );

      await ctx.prisma.user.update({
        where: { id: userId },
        data: {
          messageThreadId: forumTopic.message_thread_id,
          botChatId: ctx.message.chat.id,
        },
      });
    }

    return ctx.scene.enter(SCENES.CHAT);
  } catch (e) {
    medbotLogger.error(e, 'appointmentScene');
  }

  return undefined;
});
