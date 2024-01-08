import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';

interface iOptions {
  calendarId: string;
  eventId?: string;
  user: Prisma.UserUncheckedCreateInput;
  appointment: Prisma.AppointmentUncheckedCreateInput;
}

export function createGoogleCalendarEvent(options: iOptions) {
  const { calendarId, eventId, user, appointment } = options;

  return {
    calendarId,
    eventId,
    requestBody: {
      summary: `${user.surname} ${user.name} ${user.patronymic ?? ''}`.trim(),
      start: {
        dateTime: appointment.time as string,
        timeZone: 'Etc/Universal',
      },
      end: {
        dateTime: dayjs(appointment.time).add(1, 'hour').toISOString(),
        timeZone: 'Etc/Universal',
      },
      description: `
        Link to tg chat: https://t.me/c/2086610592/${user.messageThreadId}
        Info about user: https://TODO.MAKE.ME
      `,
      reminders: {
        useDefault: true,
      },
    },
  };
}
