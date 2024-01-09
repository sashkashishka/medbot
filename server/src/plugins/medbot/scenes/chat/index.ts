import { Scenes } from 'telegraf';
import { SCENES } from '../../constants/scenes.js';
import type { iMedbotContext } from '../../types.js';
import { setMessageThreadId } from '../../middlewares/setMessageThreadId.js';
import { MESSAGES } from './messages.js';
import { medbotLogger } from '../../../../logger.js';

export const chatScene = new Scenes.BaseScene<iMedbotContext>(SCENES.CHAT);

chatScene.enter(async (ctx) => {
  await Promise.all([ctx.reply(MESSAGES.CHAT)]);
});

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
