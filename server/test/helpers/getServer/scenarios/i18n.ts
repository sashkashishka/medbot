import type { FastifyInstance } from 'fastify';
import type { tLang, tNamespace } from '../../../../src/plugins/i18n/i18n.js';
import { medbotNs } from '../../../../src/plugins/i18n/ns/medbot.js';

export interface iI18nOptions {
  lang: tLang;
  ns: tNamespace;
}

export async function i18n(
  fastify: FastifyInstance,
  { lang, ns }: iI18nOptions,
) {
  if (ns === 'medbot') {
    const data = Object.keys(medbotNs).map((key) => ({
      key,
      namespace: ns,
      [lang]: medbotNs[key],
    }));

    await fastify.prisma.i18n.createMany({
      data,
    });
  }
}
