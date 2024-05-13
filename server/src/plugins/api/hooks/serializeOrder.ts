import { Prisma } from '@prisma/client';
import type { preSerializationAsyncHookHandler } from 'fastify';
import { userIdToNumber } from '../utils/serializers.js';
import { compose } from 'rambda';

const transformOrder = compose(
  userIdToNumber<Prisma.OrderUncheckedCreateInput>('userId'),
);

export const serializeOrder: preSerializationAsyncHookHandler =
  async function serializeOrder(
    _request,
    _reply,
    payload: Prisma.OrderUncheckedCreateInput,
  ) {
    if (payload === null) return payload;

    return transformOrder(payload);
  };

export const serializeOrderList: preSerializationAsyncHookHandler =
  async function serializeOrderList(
    _request,
    _reply,
    payload: { items: Prisma.OrderUncheckedCreateInput[]; count: number },
  ) {
    return {
      ...payload,
      items: payload.items.map(transformOrder),
    };
  };
