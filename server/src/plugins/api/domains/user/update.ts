import type { Prisma } from '@prisma/client';
import type { RouteOptions } from 'fastify';
import { checkIsUserExists } from '../../hooks/checkIsUserExists.js';

interface iParams {
  userId: string;
}

export const updateUserRoute: RouteOptions = {
  method: 'PATCH',
  url: '/user/update/:userId',
  schema: {
    body: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        surname: { type: 'string' },
        patronymic: { type: 'string' },
        birthDate: { type: 'string' },
        topicForumId: { type: 'number' },
        phone: { type: 'string' },
        email: { type: 'string' },
        messageThreadId: { type: 'number' },
        botChatId: { type: 'number' },
        timezoneOffset: { type: 'number' },
        timeZone: { type: 'string' },
      },
      required: [
        'name',
        'surname',
        'birthDate',
        'phone',
        'email',
        'timezoneOffset',
      ],
    },
    params: {
      type: 'object',
      properties: {
        userId: { type: 'number' },
      },
      required: ['userId'],
    },
  },
  preHandler: [checkIsUserExists],
  handler(req) {
    const params = req.params as iParams;
    const body = req.body as Prisma.UserUncheckedUpdateInput;

    return this.prisma.user.update({
      where: { id: Number(params.userId) },
      data: body,
    });
  },
};
