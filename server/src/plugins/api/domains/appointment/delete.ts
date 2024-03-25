import type { RouteOptions } from 'fastify';
import { cannotDeleteNotActiveAppointment } from '../../hooks/preHandler/cannotDeleteNotActiveAppointment.js';

interface iParams {
  appointmentId: string;
}

export const deleteAppointmentRoute: RouteOptions = {
  method: 'DELETE',
  url: '/appointment/:appointmentId',
  preHandler: [cannotDeleteNotActiveAppointment],
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
