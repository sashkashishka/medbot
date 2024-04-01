import { type Prisma } from '@prisma/client';

export const user: Prisma.UserUncheckedCreateInput = {
  id: 1,
  name: 'Kate',
  surname: 'Smith',
  birthDate: '1990-01-01T19:40:27.326Z',
  phone: '+1234567890',
  email: 'kate@test.com',
  messageThreadId: 1,
  botChatId: 123,
};

export const user2: Prisma.UserUncheckedCreateInput = {
  id: 2,
  name: 'David',
  surname: 'Owen',
  birthDate: '1992-01-01T19:40:27.326Z',
  phone: '+1234567890',
  email: 'david@test.com',
  messageThreadId: 2,
  botChatId: 124,
};
