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

    const orders = await this.prisma.order.findMany({
      where: { userId: Number(userId), status: 'ACTIVE' },
    });
    const appointments = await this.prisma.appointment.findMany({
      where: { userId: Number(userId), status: 'ACTIVE' },
    });

    const pendingArr = [];

    orders.forEach((order) => {
      pendingArr.push(
        this.prisma.order.update({
          where: { id: order?.id },
          data: { status: 'DONE' },
        }),
      );
    });
    appointments.map((appointment) => {
      pendingArr.push(
        this.prisma.appointment.update({
          where: { id: appointment?.id },
          data: { status: 'DELETED' },
        }),
      );

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
