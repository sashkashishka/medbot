import type { Update } from 'telegraf/types';
import { Scenes } from 'telegraf';
import { SCENES } from '../../constants/scenes.js';
import type { iMedbotContext } from '../../types.js';
import { medbotLogger } from '../../../../logger.js';
import { ignoreGeneralTopicUpdates } from './middlewares/ignoreGeneralTopicUpdates.js';
import { setBotChatId } from './middlewares/setBotChatId.js';
import { createOrderChecker } from '../../middlewares/createOrderChecker.js';
import { replyOrderNotActive } from './utils.js';

export const forumScene = new Scenes.BaseScene<iMedbotContext>(SCENES.FORUM);

forumScene.use(ignoreGeneralTopicUpdates);
forumScene.use(setBotChatId);

forumScene.use(
  createOrderChecker(
    (ctx) => ({
      id: (ctx.update as Update.MessageUpdate).message.message_thread_id,
      idType: 'messageThreadId',
    }),

    // TODO: do we need to teardown user here?
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
      medbotLogger.error(e, 'forumScene');
    }
  },
);
