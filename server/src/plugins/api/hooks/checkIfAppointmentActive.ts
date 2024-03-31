import type { preHandlerAsyncHookHandler } from 'fastify';
import { AppointmentError } from '../utils/errors.js';

declare module 'fastify' {
  // eslint-disable-next-line
  export interface FastifyRequest {
    $calendarEventId?: string;
  }
}

export const checkIfAppointmentActive: preHandlerAsyncHookHandler =
  async function checkIfAppointmentActive(request) {
    const params = request.params as { appointmentId: string };

    const { appointmentId } = params;

    const count = await this.prisma.appointment.count({
      where: {
        id: Number(appointmentId),
        status: 'ACTIVE',
      },
    });

    if (count === 0) {
      throw new AppointmentError('cannot-delete-not-active-appointment');
    }
  };
