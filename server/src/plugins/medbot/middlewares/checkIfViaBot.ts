import type { MiddlewareFn } from 'telegraf';
import type { iMedbotContext } from '../types.js';
import type { Message, Update } from 'telegraf/types';

type tUpd = { message: Update.NonChannel & Update.New & Message.TextMessage };

export const checkIfViaBot: MiddlewareFn<iMedbotContext> =
  async function checkIfViaBot(ctx: iMedbotContext, next) {
    if (!(ctx.update as tUpd).message.via_bot) return undefined;

    return next();
  };
