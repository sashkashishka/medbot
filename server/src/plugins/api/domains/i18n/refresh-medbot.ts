import type { RouteOptions } from 'fastify';

export const refreshMedbotTranslationRoute: RouteOptions = {
  method: 'GET',
  url: '/i18n/refresh',
  handler() {
    this.i18n.refreshTranslations();
    return this.i18n.loading();
  },
};
