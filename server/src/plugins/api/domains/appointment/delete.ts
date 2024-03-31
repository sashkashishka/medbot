import type { RouteOptions } from 'fastify';
import { checkIfAppointmentActive } from '../../hooks/checkIfAppointmentActive.js';
import { decorateWithGoogleCalendarEventId } from '../../hooks/decorateWithGoogleCalendarEventId.js';

interface iParams {
  appointmentId: string;
}

export const deleteAppointmentRoute: RouteOptions = {
  method: 'DELETE',
  url: '/appointment/:appointmentId',
  preHandler: [checkIfAppointmentActive, decorateWithGoogleCalendarEventId],
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
