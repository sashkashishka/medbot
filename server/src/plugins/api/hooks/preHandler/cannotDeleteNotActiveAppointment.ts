import type { preHandlerAsyncHookHandler } from 'fastify';
import { AppointmentError } from '../../utils/errors.js';

declare module 'fastify' {
  // eslint-disable-next-line
  export interface FastifyRequest {
    $calendarEventId?: string;
  }
}

export const cannotDeleteNotActiveAppointment: preHandlerAsyncHookHandler =
  async function cannotDeleteNotActiveAppointment(request) {
    const params = request.params as { appointmentId: string };

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
  };
