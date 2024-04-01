import type { MiddlewareFn } from 'telegraf';
import type { Update } from 'telegraf/types';
import type { iMedbotContext } from '../../../types.js';
import { medbotLogger } from '../../../../../logger.js';
import { SCENES } from '../../../constants/scenes.js';

export const createForumTopic: MiddlewareFn<iMedbotContext> =
  async function createForumTopic(ctx: iMedbotContext) {
    const { update, serviceApiSdk, telegram, forumId, message, scene } = ctx;

    try {
      const userId = (update as Update.MessageUpdate).message.from.id;

      const [user, err] = await serviceApiSdk.user(userId);

      if (err) {
        throw err;
      }

      if (!user.messageThreadId) {
        const forumTopic = await telegram.createForumTopic(
          forumId,
          `${message.from.id}: ${user.surname} ${user.name} ${
            user.patronymic ?? ''
          }`.trim(),
        );

        const [_data, err] = await serviceApiSdk.updateUser(userId, {
          ...user,
          messageThreadId: forumTopic.message_thread_id,
          botChatId: message.chat.id,
        });

        if (err) {
          throw err;
        }
      }

      await ctx.deleteMessage(
        (update as Update.MessageUpdate).message.message_id,
      );

      return scene.enter(SCENES.CHAT);
    } catch (e) {
      medbotLogger.error(e, 'appointmentScene');
      return undefined;
    }
  };
