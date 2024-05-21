import type { RouteOptions } from 'fastify';
import { serializeUser } from '../../hooks/serializeUser.js';

interface iParams {
  messageThreadId: string;
}

export const botChatIdRoute: RouteOptions = {
  method: 'GET',
  url: '/bot-chat-id/:messageThreadId',
  schema: {
    params: {
      type: 'object',
      properties: {
        messageThreadId: { type: 'number' },
      },
      required: ['messageThreadId'],
    },
  },
  preSerialization: [serializeUser],
  handler(req) {
    const params = req.params as iParams;
    const { messageThreadId } = params;

    return this.prisma.user.findFirst({
      where: { messageThreadId: Number(messageThreadId) },
      select: {
        botChatId: true,
      },
    });
  },
};
