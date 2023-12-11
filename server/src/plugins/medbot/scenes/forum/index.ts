import { Scenes } from 'telegraf';
import { SCENES } from '../../constants/scenes.js';
import type { iMedbotContext } from '../../types.js';
import { setBotChatId } from '../../middlewares/setBotChatId.js';
import { ignoreGeneralTopicUpdates } from '../../middlewares/ignoreGeneralTopicUpdates.js';

export const forumScene = new Scenes.BaseScene<iMedbotContext>(SCENES.FORUM);

forumScene.use(ignoreGeneralTopicUpdates);
forumScene.use(setBotChatId);

forumScene.use(async (ctx) => {
  try {
    console.log('$$$$$$$$$$$$$$$$$$$$$');
    console.log('$$$$$$$$$$$$$$$$$$$$$');
    console.log('$$$$$$$$$$$$$$$$$$$$$');
    console.log('forum middleware obtain');
    console.log('forum');
    console.log(ctx.session);

    await ctx.telegram.copyMessage(
      ctx.session.botChatId,
      ctx.message.chat.id,
      ctx.message.message_id,
    );
  } catch (e) {
    console.error(e);
  }
});
