import type { RouteOptions } from 'fastify';

interface iBody {
  userId: number;
  botChatId: number;
}

export const tgCompleteAppointmentRoute: RouteOptions = {
  method: 'PATCH',
  url: '/bot/appointment/complete',
  schema: {
    body: {
      type: 'object',
      required: ['botChatId'],
      properties: {
        userId: { type: 'number' },
        botChatId: { type: 'number' },
      },
    },
  },
  async handler(req) {
    const body = req.body as iBody;

    const order = await this.prisma.order.findFirst({
      where: {
        userId: body.userId,
        status: 'ACTIVE',
      },
    });

    await this.medbotSdk.completeAppointment(body.botChatId, order);

    return { done: true };
  },
};
