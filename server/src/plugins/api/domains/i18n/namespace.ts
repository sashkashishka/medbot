import type { RouteOptions } from 'fastify';
import type { tLang, tNamespace, tNsTranslations } from '../../../i18n/i18n.js';

interface iParams {
  lang: tLang;
  ns: tNamespace;
}

export const namespaceRoute: RouteOptions = {
  method: 'GET',
  url: '/i18n/ns/:lang/:ns',
  schema: {
    params: {
      type: 'object',
      properties: {
        lang: { type: 'string' },
        ns: { type: 'string' },
      },
    },
  },
  async handler(req) {
    const { ns, lang } = req.params as iParams;

    const data = await this.prisma.i18n.findMany({
      where: {
        namespace: ns,
        [lang]: { not: undefined },
      },
      select: {
        id: true,
        namespace: true,
        key: true,
        [lang]: true,
      },
    });

    return (data || []).reduce<tNsTranslations>(
      (acc, curr) => {
        acc[ns][curr.key] = curr[lang];

        return acc;
      },
      { [ns]: {} },
    );
  },
};

