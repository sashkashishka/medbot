import type { RouteOptions } from 'fastify';

interface iBody {
  userId: number;
  botChatId: number;
}

export const tgCreateAppointmentRoute: RouteOptions = {
  method: 'PATCH',
  url: '/bot/appointment/create',
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

    const [user, appointment] = await this.prisma.$transaction([
      this.prisma.user.findFirst({ where: { id: Number(body.userId) } }),
      this.prisma.appointment.findFirst({
        where: {
          userId: Number(body.userId),
          status: 'ACTIVE',
        },
      }),
    ]);

    await this.medbotSdk.createAppointment(body.botChatId, user, appointment);

    return { done: true };
  },
};
