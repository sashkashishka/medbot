import dayjs from 'dayjs';
import {
  getFreeSlots,
  isEarly,
  isOccupied,
  isWithinWorkingHours,
} from '../time.js';
import { Prisma } from '@prisma/client';

describe('time utilities', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    jest.setSystemTime(new Date('2024-01-07T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.setSystemTime(new Date());
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('isEarly', () => {
    it('isEarly', () => {
      const cases = [
        [dayjs().toISOString(), true],
        [dayjs().subtract(1, 'hour').toISOString(), true],
        [dayjs().add(1, 'hour').toISOString(), true],
        [dayjs().add(90, 'minutes').toISOString(), true],
        [dayjs().add(119, 'minutes').toISOString(), true],
        [dayjs().add(120, 'minutes').toISOString(), false],
        [dayjs().add(121, 'minutes').toISOString(), false],
        [dayjs().add(3, 'hour').toISOString(), false],
      ] as const;

      cases.forEach(([time, result]) => {
        expect(isEarly(time)).toBe(result);
      });
    });
  });

  describe('isWithinWorkingHours', () => {
    it('isWithinWorkingHours', () => {
      const cases = [
        [dayjs().set('hour', 0).toISOString(), false],
        [dayjs().set('hour', 1).toISOString(), false],
        [dayjs().set('hour', 2).toISOString(), false],
        [dayjs().set('hour', 3).toISOString(), false],
        [dayjs().set('hour', 4).toISOString(), false],
        [dayjs().set('hour', 5).toISOString(), false],
        [dayjs().set('hour', 6).toISOString(), false],
        [dayjs().set('hour', 7).toISOString(), false],
        [dayjs().set('hour', 8).toISOString(), false],
        [dayjs().set('hour', 9).toISOString(), false],
        [dayjs().set('hour', 10).toISOString(), true],
        [dayjs().set('hour', 11).toISOString(), true],
        [dayjs().set('hour', 12).toISOString(), true],
        [dayjs().set('hour', 13).toISOString(), true],
        [dayjs().set('hour', 14).toISOString(), true],
        [dayjs().set('hour', 15).toISOString(), true],
        [dayjs().set('hour', 16).toISOString(), true],
        [dayjs().set('hour', 17).toISOString(), true],
        [dayjs().set('hour', 18).toISOString(), true],
        [dayjs().set('hour', 19).toISOString(), true],
        [dayjs().set('hour', 20).toISOString(), true],
        [dayjs().set('hour', 21).toISOString(), true],
        [dayjs().set('hour', 22).toISOString(), false],
        [dayjs().set('hour', 23).toISOString(), false],
      ] as const;

      cases.forEach(([time, result]) => {
        expect(isWithinWorkingHours(time)).toBe(result);
      });
    });
  });

  describe('isOccupied', () => {
    it('isOccupied', () => {
      const cases = [
        [dayjs().toISOString(), dayjs().toISOString(), true],
        [
          dayjs().startOf('hour').subtract(1, 'hour').toISOString(),
          dayjs().startOf('hour').toISOString(),
          false,
        ],
        [
          dayjs().startOf('hour').add(30, 'minutes').toISOString(),
          dayjs().startOf('hour').toISOString(),
          true,
        ],
        [
          dayjs().startOf('hour').subtract(1, 'minutes').toISOString(),
          dayjs().startOf('hour').toISOString(),
          false,
        ],
        [
          dayjs().startOf('hour').add(59, 'minutes').toISOString(),
          dayjs().startOf('hour').toISOString(),
          true,
        ],
        [
          dayjs().startOf('hour').add(60, 'minutes').toISOString(),
          dayjs().startOf('hour').toISOString(),
          false,
        ],
        [
          dayjs().startOf('hour').add(61, 'minutes').toISOString(),
          dayjs().startOf('hour').toISOString(),
          false,
        ],
      ] as const;

      cases.forEach(([time, appointmentTime, result]) => {
        expect(isOccupied(time, appointmentTime)).toBe(result);
      });
    });
  });

  describe('getFreeSlots', () => {
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

    it('should return right times between 10 and 22', () => {
      jest.setSystemTime(dayjs().startOf('day').toDate());

      const result = getFreeSlots([], 1);

      expect(result).toMatchSnapshot();
    });

    it('should return slots for next days', () => {
      jest.setSystemTime(dayjs().startOf('day').toDate());

      const result = getFreeSlots([], 2);

      expect(result).toMatchSnapshot();
    });

    it('should return first slot 2 hours after current time', () => {
      jest.setSystemTime(dayjs().startOf('day').set('hour', 14).toDate());

      const result = getFreeSlots([], 1);

      expect(result).toMatchSnapshot();
    });

    it('should exclude occupied times from range', () => {
      jest.setSystemTime(dayjs().startOf('day').set('hour', 14).toDate());

      const result = getFreeSlots(
        [
          generateAppointment(dayjs().set('hour', 18).toISOString()),
          generateAppointment(dayjs().set('hour', 19).toISOString()),
          generateAppointment(dayjs().set('hour', 21).toISOString()),
          generateAppointment(
            dayjs().add(1, 'day').set('hour', 10).toISOString(),
          ),
          generateAppointment(
            dayjs().add(1, 'day').set('hour', 12).toISOString(),
          ),
          generateAppointment(
            dayjs().add(1, 'day').set('hour', 16).toISOString(),
          ),
          generateAppointment(
            dayjs().add(1, 'day').set('hour', 21).toISOString(),
          ),
        ],
        2,
      );

      expect(result).toMatchSnapshot();
    });
  });
});
