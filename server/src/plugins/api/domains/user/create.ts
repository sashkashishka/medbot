import type { Prisma } from '@prisma/client';
import type { RouteOptions } from 'fastify';
import { checkDuplicateUser } from '../../hooks/checkDuplicateUser.js';
import { serializeUser } from '../../hooks/serializeUser.js';

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
        messageThreadId: { type: 'number' },
        botChatId: { type: 'number' },
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
  preSerialization: [serializeUser],
  handler(req) {
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
    } = req.body as Prisma.UserUncheckedCreateInput;

    return this.prisma.user.create({
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
