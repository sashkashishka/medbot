import { Prisma } from '@prisma/client';
import { addDays, setHours } from 'date-fns/fp';
import {
  format,
  getHours,
  isAfter,
  isEqual,
  startOfHour,
  startOfDay,
  addHours,
  isBefore,
} from 'date-fns';
import { uk } from 'date-fns/locale';

// TODO: move to env variables
const startHour = 10;
const lastHour = 22;

export function isEarly(time: string | Date): boolean {
  return isBefore(time, addHours(new Date(), 2));
}

export function isWithinWorkingHours(time: string | Date): boolean {
  const hour = getHours(time);

  return hour >= startHour && hour < lastHour;
}

export function isOccupied(
  time: string | Date,
  appointmentTime: string | Date,
): boolean {
  const timeDate = new Date(time);
  const startDate = startOfHour(new Date(appointmentTime));
  const endDate = addHours(startDate, 1);

  return (
    (isEqual(timeDate, startDate) || isAfter(timeDate, startDate)) &&
    isBefore(timeDate, endDate)
  );
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

interface iFormatDateOptions {
  formatStr: 'hour-day-date-month-year';
}

const FORMAT_STR: Record<iFormatDateOptions['formatStr'], string> = {
  'hour-day-date-month-year': 'HH:mm eeee, dd.LL.yyyy',
};

export function formatDate(
  date: string | Date,
  options: iFormatDateOptions,
): string {
  return format(new Date(date), FORMAT_STR[options.formatStr], { locale: uk });
}
