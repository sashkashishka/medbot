import type { RouteOptions } from 'fastify';
import { AppointmentError } from '../../utils/errors.js';

declare module 'fastify' {
  // eslint-disable-next-line
  export interface FastifyRequest {
    $calendarEventId?: string;
  }
}

interface iParams {
  appointmentId: string;
}

export const deleteAppointmentRoute: RouteOptions = {
  method: 'DELETE',
  url: '/appointment/:appointmentId',
  async preHandler(request) {
    const params = request.params as iParams;

    const { appointmentId } = params;

    const appointment = await this.prisma.appointment.findFirst({
      where: {
        id: Number(appointmentId),
        status: 'ACTIVE',
      },
    });

    if (!appointment) {
      throw new AppointmentError('cannot-delete-not-active-appointment');
    }

    request.$calendarEventId = appointment.calendarEventId;
  },
  async handler(request) {
    const params = request.params as iParams;

    const { appointmentId } = params;

    const appointment = await this.prisma.appointment.update({
      where: {
        id: Number(appointmentId),
        status: 'ACTIVE',
      },
      data: {
        status: 'DELETED',
        calendarEventId: null,
      },
    });

    await this.googleCalendar.events.delete({
      calendarId: this.config.GOOGLE_CALENDAR_ID,
      eventId: request.$calendarEventId,
    });

    return appointment;
  },
};
