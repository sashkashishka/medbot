import type { RouteOptions } from 'fastify';
import { AppointmentError } from '../../utils/errors.js';

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
  },
  handler(request) {
    const params = request.params as iParams;

    const { appointmentId } = params;

    return this.prisma.appointment.update({
      where: {
        id: Number(appointmentId),
        status: 'ACTIVE',
      },
      data: {
        status: 'DELETED',
      },
    });
  },
};
