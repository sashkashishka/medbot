import { type Prisma } from '@prisma/client';

export const user: Prisma.UserUncheckedCreateInput = {
  id: 1,
  name: 'Kate',
  surname: 'Smith',
  patronymic: '',
  birthDate: '1990-01-01T19:40:27.326Z',
  phone: '+1234567890',
  email: 'kate@test.com',
  messageThreadId: 9999999991,
  botChatId: 9999999992,
  timezoneOffset: 0,
  timeZone: 'Etc',
};

export const user2: Prisma.UserUncheckedCreateInput = {
  id: 2,
  name: 'David',
  surname: 'Owen',
  patronymic: '',
  birthDate: '1992-01-01T19:40:27.326Z',
  phone: '+1234567890',
  email: 'david@test.com',
  messageThreadId: 9999999993,
  botChatId: 9999999994,
  timezoneOffset: 60,
  timeZone: 'America',
};
