import fp from 'fastify-plugin';
import { type FastifyPluginAsync } from 'fastify';
import { Telegraf, session } from 'telegraf';
import type { Update } from 'telegraf/types';

import { medbotLogger } from '../../logger.js';

import { medbotScenes, forumScenes } from './scenes/index.js';
import { cleanupOnSecondStartCommand } from './commands/secondStart.js';
import { debugCommand } from './commands/debug.js';
import { createIsForumUpdateFilter } from './filters/isForumUpdate.js';
import { PrismaSessionStorage } from './services/storage/prisma.js';
import { MedbotSdk } from './services/sdk/index.js';
import type { iMedbotContext } from './types.js';
import { populateContext } from './middlewares/populateContext.js';
import { loggerMiddleware } from './middlewares/loggerMiddleware.js';

declare module 'fastify' {
  // eslint-disable-next-line
  interface FastifyInstance {
    medbotSdk: MedbotSdk;
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

  // TODO detect language by user preferences
  const $t = fastify.i18n.getNs('uk', 'medbot');

  bot.use(session({ store, getSessionKey }));
  bot.use(
    populateContext({
      forumId: fastify.config.TG_BOT_FORUM_ID,
      googleEmail: fastify.config.GOOGLE_EMAIL,
      googleCalendar: fastify.googleCalendar,
      googleCalendarId: fastify.config.GOOGLE_CALENDAR_ID,
      webAppUrl: fastify.config.TG_BOT_WEBAPP_URL,
      adminAreaUrl: fastify.config.ADMIN_AREA_URL,
      serviceApiSdk: fastify.serviceApiSdk,
      logger: medbotLogger,
      $t,
    }),
  );
  bot.use(loggerMiddleware);

  // clear scene and start from scratch
  bot.command('start', cleanupOnSecondStartCommand);
  bot.command('debug', debugCommand);
  // bot.command('help')
  // bot.command('terms')

  bot.on(
    createIsForumUpdateFilter(fastify.config.TG_BOT_FORUM_ID),
    forumScenes.middleware(),
  );

  bot.on('message', medbotScenes.middleware());

  bot.catch((err) => {
    medbotLogger.error(err);
  });

  fastify.decorate(
    'medbotSdk',
    new MedbotSdk({
      telegram: bot.telegram,
      webAppUrl: fastify.config.TG_BOT_WEBAPP_URL,
      logger: medbotLogger,
      $t,
    }),
  );

  if (fastify.config.NODE_ENV === 'production') {
    const webhookHandler = await bot.createWebhook({
      domain: fastify.config.HOST,
    });

    fastify.post(
      `/telegraf/${bot.secretPathComponent()}`,
      // @ts-ignore
      webhookHandler,
    );
  } else {
    fastify.addHook('onListen', async () => {
      bot.launch();
    });
    fastify.addHook('onClose', async () => {
      bot.stop();
    });
  }
});
