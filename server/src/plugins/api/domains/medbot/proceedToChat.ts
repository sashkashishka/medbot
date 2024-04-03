import type { RouteOptions } from 'fastify';

export const proceedToChatRoute: RouteOptions = {
  method: 'GET',
  url: '/proceed-to-chat',
  handler(req) {
    const { $tgQueryId } = req;

    return this.medbotSdk.proceedToChat($tgQueryId);
  },
};
