import { Scenes } from 'telegraf';
import { SCENES } from '../../constants/scenes.js';
import type { iMedbotContext } from '../../types.js';
import { medbotLogger } from '../../../../logger.js';
import { ignoreGeneralTopicUpdates } from './middlewares/ignoreGeneralTopicUpdates.js';
import { setBotChatId } from './middlewares/setBotChatId.js';
import { checkIfHasActiveOrder } from './middlewares/checkIfHasActiveOrder.js';

export const forumScene = new Scenes.BaseScene<iMedbotContext>(SCENES.FORUM);

forumScene.use(ignoreGeneralTopicUpdates);
forumScene.use(setBotChatId);
forumScene.use(checkIfHasActiveOrder);
// TODO: check for finished orders
// if so - send back a message that order is done and user will not receive
// your message
// TODO: check for ACTIVE order
// if no active - send message back order no active order and user should create a new one

forumScene.use(async (ctx) => {
  try {
    await ctx.telegram.copyMessage(
      ctx.session.botChatId,
      ctx.message.chat.id,
      ctx.message.message_id,
    );
  } catch (e) {
    medbotLogger.error(e, 'forumScene');
  }
});
