import type { Prisma } from '@prisma/client';
import type { RouteOptions } from 'fastify';

export const createUserRoute: RouteOptions = {
  method: 'POST',
  url: '/user/create',
  schema: {
    body: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        surname: { type: 'string' },
        patronymic: { type: 'number' },
        birthDate: { type: 'string' },
        topicForumId: { type: 'number' },
        phone: { type: 'string' },
        email: { type: 'string' },
      },
      required: ['id', 'name', 'surname', 'birthDate', 'phone', 'email'],
    },
  },
  handler(req) {
    const body = req.body as Prisma.UserCreateInput;

    return this.prisma.user.create({
      data: body,
    });
  },
};
