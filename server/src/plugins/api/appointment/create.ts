import type { Prisma } from '@prisma/client';
import type { RouteOptions } from 'fastify';

export const createAppointmentRoute: RouteOptions = {
  method: 'POST',
  url: '/order/create',
  schema: {
    body: {
      type: 'object',
      properties: {
        complaints: { type: 'string' },
        complaintsStarted: { type: 'string' },
        medicine: { type: 'string' },
        chronicDiseases: { type: 'string' },
      },
      required: [
        'complaints',
        'complaintsStarted',
        'medicine',
        'chronicDiseases',
      ],
    },
  },
  handler(req) {
    const body = req.body as Prisma.AppointmentCreateInput;

    return this.prisma.appointment.create({
      data: {
        ...body,
        createdAt: new Date(),
      },
    });
  },
};
