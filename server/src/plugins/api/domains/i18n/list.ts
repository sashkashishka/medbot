import type { RouteOptions } from 'fastify';
import type { tLangs } from '../../../i18n/i18n.js';

interface iParams {
  lang: tLangs;
  ns: string;
}

export const translationListRoute: RouteOptions = {
  method: 'GET',
  url: '/i18n/list/:lang/:ns',
  schema: {
    params: {
      type: 'object',
      properties: {
        lang: { type: 'string' },
        ns: { type: 'string' },
      },
    },
  },
  handler(req) {
    const { ns, lang } = req.params as iParams;

    return this.prisma.i18n.findMany({
      where: {
        namespace: ns,
        [lang]: { not: undefined },
      },
      select: {
        namespace: true,
        key: true,
        [lang]: true,
      },
    });
  },
};
