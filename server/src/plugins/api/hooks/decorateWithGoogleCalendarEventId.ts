import type { preHandlerAsyncHookHandler } from 'fastify';

declare module 'fastify' {
  // eslint-disable-next-line
  export interface FastifyRequest {
    $calendarEventId?: string;
  }
}

export const decorateWithGoogleCalendarEventId: preHandlerAsyncHookHandler =
  async function decorateWithGoogleCalendarEventId(request) {
    const params = request.params as { appointmentId: string };

    const { appointmentId } = params;

    const appointment = await this.prisma.appointment.findFirst({
      where: {
        id: Number(appointmentId),
        status: 'ACTIVE',
      },
      select: {
        calendarEventId: true,
      },
    });

    request.$calendarEventId = appointment.calendarEventId;
  };
