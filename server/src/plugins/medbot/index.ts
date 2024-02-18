import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
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
    medbotToken: string;
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

const medbotPlugin: FastifyPluginAsync = fp(async (server) => {
  const bot = new Telegraf<iMedbotContext>(server.config.TG_BOT_TOKEN, {
    telegram: { testEnv: !!server.config.TG_BOT_TEST },
  });
  const store = new PrismaSessionStorage(server.prisma);

  bot.use(session({ store, getSessionKey }));
  bot.use(loggerMiddleware);
  bot.use(
    populateContext({
      prisma: server.prisma,
      forumId: server.config.TG_BOT_FORUM_ID,
      googleCalendar: server.googleCalendar,
      googleCalendarId: server.googleCalendarId,
      webAppUrl: server.config.TG_BOT_WEBAPP_URL,
    }),
  );

  // clear scene and start from scratch
  bot.command('start', cleanupOnSecondStartCommand);

  bot.on(
    createIsForumUpdateFilter(server.config.TG_BOT_FORUM_ID),
    forumScenes.middleware(),
  );
  bot.on('message', medbotScenes.middleware());

  bot.catch((err) => {
    medbotLogger.error(err);
  });

  // Make medbot Client available through the fastify server instance: server.medbot
  server.decorate('medbot', bot);
  server.decorate('medbotToken', server.config.TG_BOT_TOKEN);

  server.addHook('onListen', async () => {
    bot.launch();
  });

  server.addHook('onClose', async () => {
    bot.stop();
  });
});

export default medbotPlugin;
