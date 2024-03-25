import type { RouteOptions } from 'fastify';

interface iBody {
  botChatId: number;
  text: string;
}

export const sendMessageRoute: RouteOptions = {
  method: 'POST',
  url: '/send-message',
  handler(req) {
    const body = req.body as iBody;

    return this.medbot.telegram.sendMessage(body.botChatId, body.text);
  },
};
