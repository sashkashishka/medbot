import type { FastifyPluginAsync } from 'fastify';
import type { Logger } from 'pino';
import fp from 'fastify-plugin';
import { Telegram } from 'telegraf';
import { MedbotSdk } from '../../../../src/plugins/medbot/services/sdk/sdk.js';

export const medbotPluginMock: FastifyPluginAsync = fp(async (fastify) => {
  fastify.decorate(
    'medbotSdk',
    new MedbotSdk({
      telegram: new Telegram(''),
      webAppUrl: '',
      logger: fastify.log as Logger,
    }),
  );
});
