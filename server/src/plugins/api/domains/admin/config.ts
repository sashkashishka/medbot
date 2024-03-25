import type { RouteOptions } from 'fastify';

export const adminConfigRoute: RouteOptions = {
  method: 'GET',
  url: '/config',
  handler() {
    return {
      forumUrlTemplate: this.config.TG_BOT_FORUM_URL_TEMPLATE,
      googleEmail: this.config.GOOGLE_EMAIL,
    };
  },
};
