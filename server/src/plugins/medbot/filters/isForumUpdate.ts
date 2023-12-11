import type { Update } from 'telegraf/types';
import { ENV_VARS } from '../constants/envVars.js';

export function isForumUpdate(
  update: Update.MessageUpdate,
): update is Update.MessageUpdate {
  return update.message?.chat?.id === Number(ENV_VARS.FORUM_ID);
}
