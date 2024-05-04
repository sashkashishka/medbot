import t from 'tap';
import {
  addDays,
  addHours,
  addMinutes,
  setHours,
  startOfDay,
} from 'date-fns';
import { type Prisma } from '@prisma/client';
import fakeTimer from '@sinonjs/fake-timers';
import {
  getFreeSlots,
  isEarly,
  isWithinWorkingHours,
} from '../time.js';

const test = t.test;
const before = t.before;
const after = t.after;
const beforeEach = t.beforeEach;
const afterEach = t.afterEach;

test('time utilities', (t) => {
  let clock: fakeTimer.InstalledClock;

  before(() => {
    clock = fakeTimer.install({ shouldClearNativeTimers: true });
  });

  beforeEach(() => {
    clock.setSystemTime(new Date('2024-01-07T12:00:00.000Z'));
  });

  afterEach(() => {
    clock.setSystemTime(new Date());
  });

  after(() => {
    clock.uninstall();
  });

  test('isEarly', (t) => {
    const date = new Date();
    const cases = [
      [date.toISOString(), true],
      [addHours(date, -1).toISOString(), true],
      [addHours(date, 1).toISOString(), true],
      [addMinutes(date, 90).toISOString(), true],
      [addMinutes(date, 119).toISOString(), true],
      [addMinutes(date, 120).toISOString(), false],
      [addMinutes(date, 121).toISOString(), false],
      [addHours(date, 3).toISOString(), false],
    ] as const;

    cases.forEach(([time, result]) => {
      t.equal(isEarly(time), result);
    });
    t.end();
  });

  test('isWithinWorkingHours', (t) => {
    const date = new Date();
    const cases = [
      [setHours(date, 0).toISOString(), false],
      [setHours(date, 1).toISOString(), false],
      [setHours(date, 2).toISOString(), false],
      [setHours(date, 3).toISOString(), false],
      [setHours(date, 4).toISOString(), false],
      [setHours(date, 5).toISOString(), false],
      [setHours(date, 6).toISOString(), false],
      [setHours(date, 7).toISOString(), false],
      [setHours(date, 8).toISOString(), false],
      [setHours(date, 9).toISOString(), false],
      [setHours(date, 10).toISOString(), true],
      [setHours(date, 11).toISOString(), true],
      [setHours(date, 12).toISOString(), true],
      [setHours(date, 13).toISOString(), true],
      [setHours(date, 14).toISOString(), true],
      [setHours(date, 15).toISOString(), true],
      [setHours(date, 16).toISOString(), true],
      [setHours(date, 17).toISOString(), true],
      [setHours(date, 18).toISOString(), true],
      [setHours(date, 19).toISOString(), true],
      [setHours(date, 20).toISOString(), true],
      [setHours(date, 21).toISOString(), true],
      [setHours(date, 22).toISOString(), false],
      [setHours(date, 23).toISOString(), false],
    ] as const;

    cases.forEach(([time, result]) => {
      t.equal(isWithinWorkingHours(time), result);
    });
    t.end();
  });

  test('getFreeSlots', (t) => {
    const generateAppointment = (
      time: string,
    ): Prisma.AppointmentUncheckedCreateInput => ({
      orderId: 1,
      userId: 1,
      status: 'ACTIVE',
      time,
      chronicDiseases: '',
      medicine: '',
      complaints: '',
      complaintsStarted: '',
    });

    test('should return right times between 10 and 22', async (t) => {
      clock.setSystemTime(startOfDay(new Date()));

      const result = getFreeSlots([], 1);

      t.matchSnapshot(result);
    });

    test('should return slots for next days', async (t) => {
      clock.setSystemTime(startOfDay(new Date()));

      const result = getFreeSlots([], 2);

      t.matchSnapshot(result);
    });

    test('should return first slot 2 hours after current time', async (t) => {
      clock.setSystemTime(setHours(startOfDay(new Date()), 14));

      const result = getFreeSlots([], 1);

      t.matchSnapshot(result);
    });

    test('should exclude occupied times from range', async (t) => {
      clock.setSystemTime(setHours(startOfDay(new Date()), 14));

      const nextDay = addDays(new Date(), 1);

      const result = getFreeSlots(
        [
          generateAppointment(setHours(new Date(), 18).toISOString()),
          generateAppointment(setHours(new Date(), 19).toISOString()),
          generateAppointment(setHours(new Date(), 21).toISOString()),
          generateAppointment(setHours(nextDay, 10).toISOString()),
          generateAppointment(setHours(nextDay, 12).toISOString()),
          generateAppointment(setHours(nextDay, 16).toISOString()),
          generateAppointment(setHours(nextDay, 21).toISOString()),
        ],
        2,
      );

      t.matchSnapshot(result);
    });

    t.end();
  });

  t.end();
});
