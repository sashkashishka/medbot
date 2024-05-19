import fp from 'fastify-plugin';
import { type FastifyPluginAsync } from 'fastify';
import { createI18n } from '@nanostores/i18n';

import { Internationalisation } from './i18n.js';
import { medbotNs } from './ns/medbot.js';

declare module 'fastify' {
  // eslint-disable-next-line
  interface FastifyInstance {
    i18n: Internationalisation;
  }
}

export const i18nPlugin: FastifyPluginAsync = fp(async (fastify) => {
  const i18n = new Internationalisation(fastify.serviceApiSdk, createI18n);

  i18n.addNs('uk', 'medbot', medbotNs);

  fastify.decorate('i18n', i18n);

  fastify.addHook('onListen', async () => {
    i18n.subscribe();
    await i18n.loading();
  });

  fastify.addHook('onClose', async () => {
    i18n.unsubscribe();
  });

  await i18n.loading();
});
