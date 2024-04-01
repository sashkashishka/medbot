import type { RouteOptions } from 'fastify';

interface iParams {
  userId: string;
}

export const teardownUserDataRoute: RouteOptions = {
  method: 'GET',
  url: '/teardown-user-data/:userId',
  async handler(req) {
    const params = req.params as iParams;
    const { userId } = params;

    const appointments = await this.prisma.appointment.findMany({
      where: { userId: Number(userId), status: 'ACTIVE' },
    });

    const pendingArr: Promise<any>[] = [
      this.prisma.$transaction([
        this.prisma.telegrafSessions.updateMany({
          where: {
            OR: [
              {
                key: {
                  contains: String(userId),
                },
              },
              {
                session: { contains: String(userId) },
              },
            ],
          },
          data: { session: JSON.stringify({ __scenes: {} }) },
        }),
        this.prisma.order.updateMany({
          where: { userId: Number(userId), status: 'ACTIVE' },
          data: { status: 'DONE' },
        }),
        this.prisma.appointment.updateMany({
          where: { userId: Number(userId), status: 'ACTIVE' },
          data: { status: 'DELETED' },
        }),
      ]),
    ];

    appointments.map((appointment) => {
      pendingArr.push(
        this.googleCalendar.events.delete({
          calendarId: this.config.GOOGLE_CALENDAR_ID,
          eventId: appointment.calendarEventId,
        }),
      );
    });

    await Promise.all(pendingArr);

    return { done: true };
  },
};
