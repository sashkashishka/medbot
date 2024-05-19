import type { RouteOptions } from 'fastify';
import type { tNamespaces } from '../../../i18n/i18n.js';

export const namespaceListRoute: RouteOptions = {
  method: 'GET',
  url: '/i18n/namespaces',
  handler(): tNamespaces[] {
    return ['medbot', 'webapp'];
  },
};
