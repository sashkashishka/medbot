import { Prisma } from '@prisma/client';
import { addDays, setHours } from 'date-fns/fp';
import { getHours, startOfDay, addHours, isBefore, addMinutes } from 'date-fns';

// TODO: move to env variables
const startHour = 10;
const lastHour = 22;
const minLeadHours = 2;

export function isEarly(time: string | Date): boolean {
  return isBefore(time, addHours(new Date(), minLeadHours));
}

export function isWithinWorkingHours(time: string | Date): boolean {
  const hour = getHours(time);

  return hour >= startHour && hour < lastHour;
}

interface iFreeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

export function getFreeSlots(
  appointments: Prisma.AppointmentUncheckedCreateInput[],
  daySpan = 14,
): iFreeSlot[] {
  const occupiedSlots = appointments.reduce<Record<string, boolean>>(
    (acc, curr) => {
      const isoDate = new Date(curr.time).toISOString();
      acc[isoDate] = true;
      return acc;
    },
    {},
  );

  return Array.from({ length: daySpan })
    .reduce<iFreeSlot[]>((acc, _curr, dayIndex) => {
      const slots = Array.from({ length: lastHour - startHour }).map(
        (_v, i) => {
          const [date] = [new Date()]
            .map(startOfDay)
            .map(addDays(dayIndex))
            .map(setHours(startHour + i));

          return {
            id: date.toISOString(),
            startTime: date.toISOString(),
            endTime: addHours(date, 1).toISOString(),
          };
        },
      );

      return acc.concat(slots);
    }, [])
    .filter((slot) => {
      if (isEarly(slot.startTime)) return false;

      return !occupiedSlots[slot.startTime];
    });
}

interface iFormatDateOptions extends Intl.DateTimeFormatOptions {
  locale?: string;
  timeZone?: string;
  timezoneOffset?: number;
}

export function formatDate(
  date: string | Date,
  options: iFormatDateOptions = {},
): string {
  const {
    locale = 'uk-UA',
    timeZone,
    timezoneOffset,
    dateStyle = 'medium',
    timeStyle = 'short',
  } = options;

  let d = new Date(date);

  if (!timeZone) {
    d = addMinutes(d, -timezoneOffset);
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle,
    timeStyle,
    timeZone: timeZone || undefined,
  }).format(d);
}
