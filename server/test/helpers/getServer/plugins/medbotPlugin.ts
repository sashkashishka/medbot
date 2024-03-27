import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { Telegraf, Telegram } from 'telegraf';

export const medbotPluginMock: FastifyPluginAsync = fp(async (fastify) => {
  fastify.decorate('medbot', {
    telegram: new Telegram(fastify.config.TG_BOT_TOKEN),
  } as Telegraf);
});
