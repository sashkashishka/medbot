import { Prisma } from '@prisma/client';
import type { RouteOptions } from 'fastify';

import { checkIfAppointmentExists } from '../../hooks/checkIfAppointmentExists.js';

interface iParams {
  appointmentId: string;
}

export const prescriptAppointmentRoute: RouteOptions = {
  method: 'PATCH',
  url: '/appointment/prescript/:appointmentId',
  schema: {
    body: {
      type: 'object',
      properties: {
        treatment: { type: 'string' },
        report: { type: 'string' },
        notes: { type: 'string' },
      },
      required: ['treatment', 'report', 'notes'],
    },
    params: {
      type: 'object',
      properties: {
        appointmentId: { type: 'number' },
      },
      required: ['appointmentId'],
    },
  },
  preHandler: [checkIfAppointmentExists],
  async handler(request) {
    const params = request.params as iParams;
    const { treatment, report, notes } =
      request.body as Prisma.AppointmentUncheckedCreateInput;

    const { appointmentId } = params;

    return this.prisma.appointment.update({
      where: {
        id: Number(appointmentId),
      },
      data: {
        treatment,
        report,
        notes,
      },
    });
  },
};
