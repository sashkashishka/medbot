import type { Prisma } from '@prisma/client';
import type { RouteOptions } from 'fastify';
import { checkIsUserExists } from '../../hooks/checkIsUserExists.js';
import { serializeUser } from '../../hooks/serializeUser.js';

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
  preSerialization: [serializeUser],
  handler(req) {
    const params = req.params as iParams;
    const {
      id,
      name,
      surname,
      phone,
      email,
      timezoneOffset,
      timeZone,
      messageThreadId,
      patronymic,
      birthDate,
      botChatId,
    } = req.body as Prisma.UserUncheckedUpdateInput;

    return this.prisma.user.update({
      where: { id: Number(params.userId) },
      data: {
        id,
        name,
        surname,
        phone,
        email,
        timezoneOffset,
        timeZone,
        messageThreadId,
        patronymic,
        birthDate,
        botChatId,
      },
    });
  },
};
