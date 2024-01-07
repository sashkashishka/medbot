import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween.js';

dayjs.extend(isBetween);

const startHour = 10;
const lastHour = 22;

export function isEarly(time: string): boolean {
  return dayjs(time).isBefore(dayjs().add(2, 'hours'));
}

export function isWithinWorkingHours(time: string): boolean {
  const hour = dayjs(time).hour();

  return hour >= startHour && hour < lastHour;
}

export function isOccupied(
  time: string,
  appointmentTime: string | Date,
): boolean {
  return dayjs(time).isBetween(
    dayjs(appointmentTime).startOf('hour'),
    dayjs(appointmentTime).startOf('hour').add(1, 'hour'),
    'hour',
    '[)',
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
      acc[dayjs(curr.time).toISOString()] = true;
      return acc;
    },
    {},
  );

  return Array.from({ length: daySpan })
    .reduce<iFreeSlot[]>((acc, _curr, dayIndex) => {
      const slots = Array.from({ length: lastHour - startHour }).map(
        (_v, i) => {
          const date = dayjs()
            .startOf('day')
            .add(dayIndex, 'day')
            .set('hour', startHour + i);

          return {
            id: date.toISOString(),
            startTime: date.toISOString(),
            endTime: date.add(1, 'hour').toISOString(),
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
