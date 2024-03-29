import type { RouteOptions } from 'fastify';

interface iParams {
  botChatId: string;
}

export const messageThreadIdRoute: RouteOptions = {
  method: 'GET',
  url: '/message-thread-id/:botChatId',
  handler(req) {
    const params = req.params as iParams;
    const { botChatId } = params;

    return this.prisma.user.findFirst({
      where: { botChatId: Number(botChatId) },
      select: {
        messageThreadId: true,
      },
    });
  },
};
