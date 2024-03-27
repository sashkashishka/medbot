import { type Prisma } from '@prisma/client';

export const user: Prisma.UserUncheckedCreateInput = {
  id: 1,
  name: 'Kate',
  surname: 'Smith',
  birthDate: '1990-01-01T19:40:27.326Z',
  phone: '+1234567890',
  email: 'test@test.com',
};
