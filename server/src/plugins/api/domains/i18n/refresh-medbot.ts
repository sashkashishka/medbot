import type { RouteOptions } from 'fastify';

export const refreshMedbotTranslationRoute: RouteOptions = {
  method: 'GET',
  url: '/i18n/refresh',
  async handler() {
    this.i18n.refreshTranslations();

    await this.i18n.loading();

    return { done: true };
  },
};
