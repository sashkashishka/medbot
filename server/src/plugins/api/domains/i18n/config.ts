import type { RouteOptions } from 'fastify';
import type { tLangs, tNamespaces } from '../../../i18n/i18n.js';

export const i18nConfigRoute: RouteOptions = {
  method: 'GET',
  url: '/i18n/config',
  handler(): Array<{ ns: tNamespaces; lang: tLangs[] }> {
    return [
      { ns: 'medbot', lang: ['uk'] },
      { ns: 'webapp', lang: ['uk'] },
    ];
  },
};
