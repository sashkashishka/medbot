import type { Prisma } from '@prisma/client';
import type { MiddlewareFn } from 'telegraf';
import type { Update } from 'telegraf/types';
import type { iMedbotContext } from '../../../types.js';
import { medbotLogger } from '../../../../../logger.js';
import { SCENES } from '../../../constants/scenes.js';
import { forumTopicEntryMsg } from '../messages/forumTopicEntry.js';

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

        const [data, err] = await serviceApiSdk.updateUser(userId, {
          ...user,
          messageThreadId: forumTopic.message_thread_id,
          botChatId: message.chat.id,
        });

        await initTopicInfo(ctx, data);

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

async function initTopicInfo(
  ctx: iMedbotContext,
  user: Prisma.UserUncheckedCreateInput,
) {
  const { serviceApiSdk } = ctx;
  const update = ctx.update as Update.MessageUpdate;

  const linkToUserPage = `${ctx.adminAreaUrl}/user/${
    update.message.from.id
  }`;

  const botChatId = user.botChatId;

  const [product, err] = await serviceApiSdk.getActiveOrdersProduct(
    botChatId,
    'botChatId',
  );

  if (err) {
    medbotLogger.error(err, 'initTopicInfo: getActiveOrdersProduct');
  }

  await ctx.telegram.sendMessage(
    ctx.forumId,
    forumTopicEntryMsg({
      product,
      linkToUserPage,
    }),
    { message_thread_id: user.messageThreadId, parse_mode: 'Markdown' },
  );
}
