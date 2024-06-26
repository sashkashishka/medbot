import type { RouteOptions } from 'fastify';
import { checkIfAppointmentActive } from '../../hooks/checkIfAppointmentActive.js';
import { decorateWithGoogleCalendarEventId } from '../../hooks/decorateWithGoogleCalendarEventId.js';
import { serializeAppointment } from '../../hooks/serializeAppointment.js';

interface iParams {
  appointmentId: string;
}

export const deleteAppointmentRoute: RouteOptions = {
  method: 'DELETE',
  url: '/appointment/:appointmentId',
  schema: {
    params: {
      type: 'object',
      properties: {
        appointmentId: { type: 'number' },
      },
      required: ['appointmentId'],
    },
  },
  preHandler: [checkIfAppointmentActive, decorateWithGoogleCalendarEventId],
  preSerialization: [serializeAppointment],
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
      select: {
        id: true,
        orderId: true,
        userId: true,
        chronicDiseases: true,
        medicine: true,
        complaints: true,
        complaintsStarted: true,
        time: true,
        status: true,
      },
    });

    await this.googleCalendar.events.delete({
      calendarId: this.config.GOOGLE_CALENDAR_ID,
      eventId: request.$calendarEventId,
    });

    return appointment;
  },
};
