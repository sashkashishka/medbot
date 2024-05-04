import type { preHandlerAsyncHookHandler } from 'fastify';
import { AppointmentError } from '../utils/errors.js';

export const checkIfAppointmentExists: preHandlerAsyncHookHandler =
  async function checkIfAppointmentExists(request) {
    const params = request.params as { appointmentId: string };

    const { appointmentId } = params;

    const count = await this.prisma.appointment.count({
      where: {
        id: Number(appointmentId),
      },
    });

    if (count === 0) {
      throw new AppointmentError('no-such-appointment');
    }
  };
