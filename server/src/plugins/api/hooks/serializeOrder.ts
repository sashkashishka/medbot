import type { Prisma } from '@prisma/client';
import type { preSerializationAsyncHookHandler } from 'fastify';
import { userIdToNumber } from '../utils/userIdToNumber.js';

export const serializeOrder: preSerializationAsyncHookHandler =
  async function serializeOrder(
    _request,
    _reply,
    payload: Prisma.OrderUncheckedCreateInput,
  ) {
    if (payload === null) return payload;

    return userIdToNumber(payload, 'userId');
  };

export const serializeOrderList: preSerializationAsyncHookHandler =
  async function serializeOrderList(
    _request,
    _reply,
    payload: { items: Prisma.OrderUncheckedCreateInput[]; count: number },
  ) {
    return {
      ...payload,
      items: payload.items.map((o) => userIdToNumber(o, 'userId')),
    };
  };
