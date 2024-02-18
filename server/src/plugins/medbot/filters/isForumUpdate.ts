import type { Update } from 'telegraf/types';

export function createIsForumUpdateFilter(forumId: number) {
  return function isForumUpdate(
    update: Update.MessageUpdate,
  ): update is Update.MessageUpdate {
    return update.message?.chat?.id === Number(forumId);
  };
}
