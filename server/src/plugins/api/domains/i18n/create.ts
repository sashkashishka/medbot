import type { RouteOptions } from 'fastify';
import type { tLangs, tNamespaces } from '../../../i18n/i18n.js';

interface iBody {
  id: number;
  lang: tLangs;
  ns: tNamespaces;
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
        id: { type: 'number' },
        translation: { type: 'string' },
      },
      required: ['lang', 'ns', 'key', 'translation'],
    },
  },
  handler(req) {
    const { lang, ns, key, id, translation } = req.body as iBody;

    if (id) {
      return this.prisma.i18n.update({
        where: { id },
        data: { namespace: ns, key, [lang]: translation },
        select: {
          id: true,
          namespace: true,
          key: true,
          [lang]: true,
        },
      });
    }

    return this.prisma.i18n.create({
      data: {
        namespace: ns,
        key,
        [lang]: translation,
      },
      select: {
        id: true,
        namespace: true,
        key: true,
        [lang]: true,
      },
    });
  },
};
