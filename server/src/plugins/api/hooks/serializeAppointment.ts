import type { Prisma } from '@prisma/client';
import type { preSerializationAsyncHookHandler } from 'fastify';
import { userIdToNumber } from '../utils/serializers.js';
import { compose } from 'rambda';

const transformAppointment = compose(
  userIdToNumber<Prisma.AppointmentUncheckedCreateInput>('userId'),
);

export const serializeAppointment: preSerializationAsyncHookHandler =
  async function serializeAppointment(
    _request,
    _reply,
    payload: Prisma.AppointmentUncheckedCreateInput,
  ) {
    if (payload === null) return payload;

    return transformAppointment(payload);
  };

export const serializeAppointmentList: preSerializationAsyncHookHandler =
  async function serializeAppointmentList(
    _request,
    _reply,
    payload: { items: Prisma.AppointmentUncheckedCreateInput[]; count: number },
  ) {
    return {
      ...payload,
      items: payload.items.map(transformAppointment),
    };
  };
