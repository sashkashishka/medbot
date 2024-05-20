import type { FastifyInstance } from 'fastify';
import type { tLang, tNamespace } from '../../../../src/plugins/i18n/i18n.js';

export interface iI18nOptions {
  lang: tLang;
  ns: tNamespace;
}

export async function i18n(
  fastify: FastifyInstance,
  { lang, ns }: iI18nOptions,
) {
  if (ns === 'medbot') {
    await fastify.prisma.i18n.createMany({
      data: [
        {
          key: 'test',
          namespace: 'medbot',
          [lang]: 'Chatelet',
        },
      ],
    });
  }
}
