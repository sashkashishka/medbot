import {
  addHours,
  addMilliseconds,
  addMinutes,
  differenceInDays,
  differenceInMinutes,
} from 'date-fns';
import {
  createProgressiveDelay,
  type iCacheEntity,
} from '../progressive-delay.js';

describe('progressive delay', () => {
  describe('max day limit', () => {
    const options = {
      cacheCapacity: 5,
      maxAttempts: 5,
      frequencyRate: 10,
      frequencyTime: 5000,
    };

    it('should return blockedUntil when exceeded maxAttempts', () => {
      jest.useFakeTimers();
      const ip = '1.2.3.4';
      const checker = createProgressiveDelay(options);
      const date = new Date();

      let result: iCacheEntity;

      // go to threschold limit but not exceed
      Array.from({ length: options.maxAttempts }).forEach(() => {
        result = checker(ip);
      });

      expect(result.blockedUntil).toBeNull();
      expect(result.reason).toBeNull();
      expect(result.attempt).toBe(options.maxAttempts);

      // exceed frequency limit
      result = checker(ip);

      expect(result.attempt).toBe(options.maxAttempts + 1);
      expect(result.blockedUntil).toBeInstanceOf(Date);
      expect(differenceInDays(result.blockedUntil, date)).toBe(1);
      expect(result.reason).toBe('maxAttempts');

      // subsequent call after blocking
      result = checker(ip);

      expect(result.attempt).toBe(options.maxAttempts + 1);
      expect(result.blockedUntil).toBeInstanceOf(Date);
      expect(differenceInDays(result.blockedUntil, date)).toBe(1);
      expect(result.reason).toBe('maxAttempts');

      // wait
      jest.setSystemTime(addHours(date, 25));

      // call day later
      result = checker(ip);

      expect(result.blockedUntil).toBeNull();
      expect(result.reason).toBeNull();
      expect(result.attempt).toBe(1);
    });
  });

  describe('frequency limit', () => {
    const options = {
      cacheCapacity: 5,
      maxAttempts: 20,
      frequencyRate: 5,
      frequencyTime: 5000,
    };

    it('should return blockedUntil when exceeded frequencyRate', () => {
      jest.useFakeTimers();
      const ip = '1.2.3.4';
      const checker = createProgressiveDelay(options);
      const date = new Date();

      let result: iCacheEntity;

      // go to threschold limit but not exceed
      Array.from({ length: options.frequencyRate }).forEach((_, i) => {
        result = checker(ip);
        expect(result.frequencyRate).toBe(i + 1);
      });

      expect(result.blockedUntil).toBeNull();
      expect(result.attempt).toBe(options.frequencyRate);
      expect(result.frequencyRate).toBe(options.frequencyRate);
      expect(result.frequencyDueDate).toStrictEqual(date);
      expect(result.reason).toBeNull();

      // exceed frequency limit
      result = checker(ip);

      expect(result.blockedUntil).toBeInstanceOf(Date);
      expect(differenceInMinutes(result.blockedUntil, date)).toBe(15);
      expect(result.attempt).toBe(options.frequencyRate + 1);
      expect(result.frequencyRate).toBe(0);
      expect(result.frequencyDueDate).toStrictEqual(date);
      expect(result.reason).toBe('frequency');

      // subsequent call after blocking
      result = checker(ip);

      expect(result.blockedUntil).toBeInstanceOf(Date);
      expect(differenceInMinutes(result.blockedUntil, date)).toBe(15);
      expect(result.attempt).toBe(options.frequencyRate + 1);
      expect(result.frequencyRate).toBe(1);
      expect(result.frequencyDueDate).toStrictEqual(date);
      expect(result.reason).toBe('frequency');

      // wait
      jest.setSystemTime(addMinutes(new Date(), 16));
      const newDate = new Date();

      // // call 15 min later
      result = checker(ip);

      expect(result.blockedUntil).toBeNull();
      expect(result.attempt).toBe(options.frequencyRate + 2);
      expect(result.frequencyRate).toBe(1);
      expect(result.frequencyDueDate).toStrictEqual(
        addMilliseconds(newDate, options.frequencyTime),
      );
      expect(result.reason).toBeNull();

      // subsequent call
      result = checker(ip);
      expect(result.blockedUntil).toBeNull();
      expect(result.attempt).toBe(options.frequencyRate + 3);
      expect(result.frequencyRate).toBe(2);
      expect(result.frequencyDueDate).toStrictEqual(
        addMilliseconds(newDate, options.frequencyTime),
      );
      expect(result.reason).toBeNull();
    });

    it('should reset frequencyRate when check is not rapid', () => {
      jest.useFakeTimers();
      const ip = '1.2.3.4';
      const checker = createProgressiveDelay(options);
      const date = new Date();

      let result: iCacheEntity;

      // go to threschold limit but not exceed
      Array.from({ length: options.frequencyRate }).forEach((_, i) => {
        result = checker(ip);
        expect(result.frequencyRate).toBe(i + 1);
      });

      expect(result.blockedUntil).toBeNull();
      expect(result.attempt).toBe(options.frequencyRate);
      expect(result.frequencyRate).toBe(options.frequencyRate);
      expect(result.frequencyDueDate).toStrictEqual(date);
      expect(result.reason).toBeNull();

      // wait options.frequencyTime
      const newDate = addMilliseconds(date, options.frequencyTime + 1);
      jest.setSystemTime(newDate);

      // go to threschold limit but not exceed
      Array.from({ length: options.frequencyRate }).forEach((_, i) => {
        result = checker(ip);
        expect(result.frequencyRate).toBe(i + 1);
      });

      expect(result.blockedUntil).toBeNull();
      expect(result.attempt).toBe(options.frequencyRate * 2);
      expect(result.frequencyRate).toBe(options.frequencyRate);
      expect(result.frequencyDueDate).toStrictEqual(
        addMilliseconds(newDate, options.frequencyTime),
      );
      expect(result.reason).toBeNull();
    });
  });
});
