import type { RouteOptions } from 'fastify';
import type { tLangs } from '../../../i18n/i18n.js';

interface iBody {
  lang: tLangs;
  ns: string;
  key: string;
  translation: string;
}

export const createTranslationRoute: RouteOptions = {
  method: 'PUT',
  url: '/i18n/create',
  schema: {
    body: {
      type: 'object',
      properties: {
        lang: { type: 'string' },
        ns: { type: 'string' },
        key: { type: 'string' },
        translation: { type: 'string' },
      },
    },
  },
  handler(req) {
    const { lang, ns, key, translation } = req.body as iBody;

    return this.prisma.i18n.upsert({
      where: { key },
      create: {
        namespace: ns,
        key,
        [lang]: translation,
      },
      update: {
        namespace: ns,
        key,
        [lang]: translation,
      },
      select: {
        namespace: true,
        key: true,
        [lang]: true,
      },
    });
  },
};
