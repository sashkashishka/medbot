import type { RouteOptions } from 'fastify';

interface iBody {
  userId: number;
  botChatId: number;
}

export const tgDeleteAppointmentRoute: RouteOptions = {
  method: 'PATCH',
  url: '/bot/appointment/delete',
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

    await this.medbotSdk.deleteAppointment(body.botChatId);

    return { done: true };
  },
};
