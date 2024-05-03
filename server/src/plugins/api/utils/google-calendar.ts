import { Prisma } from '@prisma/client';
import { addHours } from 'date-fns';

interface iOptions {
  calendarId: string;
  tgForumUrlTemplate: string;
  adminAreaUrl: string;
  eventId?: string;
  user: Prisma.UserUncheckedCreateInput;
  appointment: Prisma.AppointmentUncheckedCreateInput;
}

export function createGoogleCalendarEvent(options: iOptions) {
  const {
    calendarId,
    eventId,
    user,
    appointment,
    tgForumUrlTemplate,
    adminAreaUrl,
  } = options;

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
      description: `Link to tg chat: ${tgForumUrlTemplate.replace(
        ':id',
        String(user.messageThreadId),
      )}
User info: ${adminAreaUrl}/user/${user.id}`,
      reminders: {
        useDefault: true,
      },
    },
  };
}
