import { Prisma } from '@prisma/client';
import { addHours } from 'date-fns';

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
        dateTime: addHours(new Date(appointment.time), 1).toISOString(),
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
