import type { Prisma } from '@prisma/client';
import type { RouteOptions } from 'fastify';
import { checkDuplicateUser } from '../../hooks/checkDuplicateUser.js';

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
        patronymic: { type: 'string' },
        birthDate: { type: 'string' },
        topicForumId: { type: 'number' },
        phone: { type: 'string' },
        email: { type: 'string' },
        timezoneOffset: { type: 'number' },
        timeZone: { type: 'string' },
      },
      required: [
        'id',
        'name',
        'surname',
        'birthDate',
        'phone',
        'email',
        'timezoneOffset',
      ],
    },
  },
  preHandler: [checkDuplicateUser],
  handler(req) {
    const body = req.body as Prisma.UserCreateInput;

    return this.prisma.user.create({
      data: body,
    });
  },
};
