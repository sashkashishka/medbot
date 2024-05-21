import type { Prisma } from '@prisma/client';
import type { preSerializationAsyncHookHandler } from 'fastify';
import { compose } from 'rambda';
import {
  botChatIdToNumber,
  messageThreadIdToNumber,
  userIdToNumber,
} from '../utils/serializers.js';

const transformUser = compose(
  userIdToNumber('id'),
  botChatIdToNumber,
  messageThreadIdToNumber,
);

export const serializeUser: preSerializationAsyncHookHandler =
  async function serializeUser(
    _request,
    _reply,
    payload: Prisma.UserUncheckedCreateInput,
  ) {
    if (payload === null) return payload;

    return transformUser(payload);
  };

export const serializeUserList: preSerializationAsyncHookHandler =
  async function serializeUserList(
    _request,
    _reply,
    payload: { items: Prisma.UserUncheckedCreateInput[]; count: number },
  ) {
    return {
      ...payload,
      items: payload.items.map(transformUser),
    };
  };
