import type { RouteOptions } from 'fastify';

interface iParams {
  messageThreadId: string;
}

export const botChatIdRoute: RouteOptions = {
  method: 'GET',
  url: '/bot-chat-id/:messageThreadId',
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
