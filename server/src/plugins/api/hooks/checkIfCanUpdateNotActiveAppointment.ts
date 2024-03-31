import type { preHandlerAsyncHookHandler } from 'fastify';
import { AppointmentError } from '../utils/errors.js';

declare module 'fastify' {
  // eslint-disable-next-line
  export interface FastifyRequest {
    $calendarEventId?: string;
  }
}

export const checkIfCanUpdateNotActiveAppointment: preHandlerAsyncHookHandler =
  async function checkIfCanUpdateNotActiveAppointment(request) {
    const params = request.params as { appointmentId: string };

    const { appointmentId } = params;

    const count = await this.prisma.appointment.count({
      where: {
        status: 'ACTIVE',
        id: Number(appointmentId),
        time: {
          gte: new Date().toISOString(),
        },
      },
    });

    if (count === 0) {
      throw new AppointmentError('cannot-update-not-active-appointment');
    }
  };
