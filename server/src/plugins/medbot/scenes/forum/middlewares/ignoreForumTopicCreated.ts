import type { MiddlewareFn } from 'telegraf';
import type { iMedbotContext } from '../../../types.js';
import type { Update } from 'telegraf/types';

export const ignoreForumTopicCreated: MiddlewareFn<iMedbotContext> =
  async function ignoreForumTopicCreated(ctx, next) {
    const update = ctx.update as Update.MessageUpdate;

    if ('forum_topic_created' in update.message) {
      return;
    }

    return next();
  };
