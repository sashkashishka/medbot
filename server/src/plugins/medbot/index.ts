import fp from 'fastify-plugin';
import { type FastifyPluginAsync } from 'fastify';
import { Telegraf, session } from 'telegraf';
import type { Update } from 'telegraf/types';

import { medbotLogger } from '../../logger.js';

import { medbotScenes, forumScenes } from './scenes/index.js';
// import { commands } from './commands/index.js';
import { createIsForumUpdateFilter } from './filters/isForumUpdate.js';
import { PrismaSessionStorage } from './services/storage/prisma.js';
import type { iMedbotContext } from './types.js';
import { populateContext } from './middlewares/populateContext.js';
import { cleanupOnSecondStartCommand } from './middlewares/cleanupOnSecondStartCommand.js';
import { loggerMiddleware } from './middlewares/loggerMiddleware.js';

declare module 'fastify' {
  // eslint-disable-next-line
  interface FastifyInstance {
    medbot: Telegraf;
  }
}

function getSessionKey(ctx: iMedbotContext): string {
  const fromId = ctx.from?.id;
  const chatId = ctx.chat?.id;
  const messageThreadId = (ctx.update as Update.MessageUpdate).message
    .message_thread_id;

  if (messageThreadId && fromId) {
    return `${fromId}:${chatId}:${messageThreadId}`;
  }

  if (fromId == null || chatId == null) return undefined;
  return `${fromId}:${chatId}`;
}

export const medbotPlugin: FastifyPluginAsync = fp(async (fastify) => {
  const bot = new Telegraf<iMedbotContext>(fastify.config.TG_BOT_TOKEN, {
    telegram: { testEnv: !!Number(fastify.config.TG_BOT_TEST) },
  });
  const store = new PrismaSessionStorage(fastify.prisma);

  bot.use(session({ store, getSessionKey }));
  bot.use(loggerMiddleware);
  bot.use(
    populateContext({
      forumId: fastify.config.TG_BOT_FORUM_ID,
      googleCalendar: fastify.googleCalendar,
      googleCalendarId: fastify.config.GOOGLE_CALENDAR_ID,
      webAppUrl: fastify.config.TG_BOT_WEBAPP_URL,
      adminAreaUrl: fastify.config.ADMIN_AREA_URL,
      serviceApiSdk: fastify.serviceApiSdk,
      logger: medbotLogger,
    }),
  );

  // clear scene and start from scratch
  bot.command('start', cleanupOnSecondStartCommand);

  bot.on(
    createIsForumUpdateFilter(fastify.config.TG_BOT_FORUM_ID),
    forumScenes.middleware(),
  );
  bot.on('message', medbotScenes.middleware());

  bot.catch((err) => {
    medbotLogger.error(err);
  });

  // Make medbot Client available through the fastify fastify instance: fastify.medbot
  fastify.decorate('medbot', bot);

  fastify.addHook('onListen', async () => {
    bot.launch();
  });

  fastify.addHook('onClose', async () => {
    bot.stop();
  });
});
