import type { Prisma } from '@prisma/client';
import type { preSerializationAsyncHookHandler } from 'fastify';
import { userIdToNumber } from '../utils/userIdToNumber.js';

export const serializeAppointment: preSerializationAsyncHookHandler =
  async function serializeAppointment(
    _request,
    _reply,
    payload: Prisma.AppointmentUncheckedCreateInput,
  ) {
    if (payload === null) return payload;

    return userIdToNumber(payload, 'userId');
  };

export const serializeAppointmentList: preSerializationAsyncHookHandler =
  async function serializeAppointmentList(
    _request,
    _reply,
    payload: { items: Prisma.AppointmentUncheckedCreateInput[]; count: number },
  ) {
    return {
      ...payload,
      items: payload.items.map((a) => userIdToNumber(a, 'userId')),
    };
  };
