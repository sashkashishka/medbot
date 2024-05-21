import type { Prisma } from '@prisma/client';

export function userIdToNumber<T = Prisma.UserUncheckedCreateInput>(
  key: string,
) {
  return function passObj(obj?: T) {
    return {
      ...obj,
      [key]: obj[key] ? Number(obj[key]) : undefined,
    };
  };
}

export function botChatIdToNumber<T extends Prisma.UserUncheckedCreateInput>(
  obj: T,
) {
  return {
    ...obj,
    botChatId: obj.botChatId ? Number(obj.botChatId) : undefined,
  };
}

export function messageThreadIdToNumber<
  T extends Prisma.UserUncheckedCreateInput,
>(obj: T) {
  return {
    ...obj,
    messageThreadId: obj.messageThreadId
      ? Number(obj.messageThreadId)
      : undefined,
  };
}
