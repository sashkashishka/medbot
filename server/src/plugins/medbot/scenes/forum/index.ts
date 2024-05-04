import { Scenes } from 'telegraf';
import { SCENES } from '../../constants/scenes.js';
import type { iMedbotContext } from '../../types.js';
import { replyOrderNotActive } from './utils.js';
import { ignoreGeneralTopicUpdates } from './middlewares/ignoreGeneralTopicUpdates.js';
import { setBotChatId } from './middlewares/setBotChatId.js';
import { ignoreForumTopicCreated } from './middlewares/ignoreForumTopicCreated.js';
import { ignorePinnedMessage } from './middlewares/ignorePinnedMessage.js';
import { createCheckOrderActive } from './middlewares/checkOrderActive.js';

export const forumScene = new Scenes.BaseScene<iMedbotContext>(SCENES.FORUM);

forumScene.use(
  // TODO: ignore reply message updates
  ignoreGeneralTopicUpdates,
  ignoreForumTopicCreated,
  ignorePinnedMessage,
  setBotChatId,
  createCheckOrderActive(
    // TODO: do we need to teardown user here?
    // teardown through messageThreadId, not userId as in chat scene
    [replyOrderNotActive],
  ),
  async (ctx) => {
    try {
      await ctx.telegram.copyMessage(
        ctx.session.botChatId,
        ctx.message.chat.id,
        ctx.message.message_id,
      );
    } catch (e) {
      ctx.logger.error(e, 'forumScene');
    }
  },
);
