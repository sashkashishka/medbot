import type { Prisma } from '@prisma/client';
import type { preSerializationAsyncHookHandler } from 'fastify';
import { userIdToNumber } from '../utils/userIdToNumber.js';

export const serializeUser: preSerializationAsyncHookHandler =
  async function serializeUser(
    _request,
    _reply,
    payload: Prisma.UserUncheckedCreateInput,
  ) {
    if (payload === null) return payload;

    return userIdToNumber(payload, 'id');
  };

export const serializeUserList: preSerializationAsyncHookHandler =
  async function serializeUserList(
    _request,
    _reply,
    payload: { items: Prisma.UserUncheckedCreateInput[]; count: number },
  ) {
    return {
      ...payload,
      items: payload.items.map((u) => userIdToNumber(u, 'id')),
    };
  };
