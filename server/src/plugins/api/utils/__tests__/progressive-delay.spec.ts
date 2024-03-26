import t from 'tap';
import {
  isEqual,
  addHours,
  addMilliseconds,
  addMinutes,
  differenceInDays,
  differenceInMinutes,
} from 'date-fns';
import fakeTimer from '@sinonjs/fake-timers';
import {
  createProgressiveDelay,
  type iCacheEntity,
} from '../progressive-delay.js';

const test = t.test;

test('max day limit', (t) => {
  const options = {
    cacheCapacity: 5,
    maxAttempts: 5,
    frequencyRate: 10,
    frequencyTime: 5000,
  };

  test('should return blockedUntil when exceeded maxAttempts', (t) => {
    const clock = fakeTimer.install({ shouldClearNativeTimers: true });

    const ip = '1.2.3.4';
    const checker = createProgressiveDelay(options);
    const date = new Date();

    let result: iCacheEntity;

    // go to threschold limit but not exceed
    Array.from({ length: options.maxAttempts }).forEach(() => {
      result = checker(ip);
    });

    t.equal(result.blockedUntil, null);
    t.equal(result.reason, null);
    t.equal(result.attempt, options.maxAttempts);

    // exceed frequency limit
    result = checker(ip);

    t.equal(result.attempt, options.maxAttempts + 1);
    t.type(result.blockedUntil, Date);
    t.equal(differenceInDays(result.blockedUntil, date), 1);
    t.equal(result.reason, 'maxAttempts');

    // subsequent call after blocking
    result = checker(ip);

    t.equal(result.attempt, options.maxAttempts + 1);
    t.type(result.blockedUntil, Date);
    t.equal(differenceInDays(result.blockedUntil, date), 1);
    t.equal(result.reason, 'maxAttempts');

    // wait
    clock.setSystemTime(addHours(date, 25));

    // call day later
    result = checker(ip);

    t.equal(result.blockedUntil, null);
    t.equal(result.reason, null);
    t.equal(result.attempt, 1);

    t.teardown(clock.uninstall);
    t.end();
  });

  t.end();
});

test('frequency limit', (t) => {
  const options = {
    cacheCapacity: 5,
    maxAttempts: 20,
    frequencyRate: 5,
    frequencyTime: 5000,
  };

  test('should return blockedUntil when exceeded frequencyRate', (t) => {
    const clock = fakeTimer.install({ shouldClearNativeTimers: true });
    const ip = '1.2.3.4';
    const checker = createProgressiveDelay(options);
    const date = new Date();

    let result: iCacheEntity;

    // go to threschold limit but not exceed
    Array.from({ length: options.frequencyRate }).forEach((_, i) => {
      result = checker(ip);
      t.equal(result.frequencyRate, i + 1);
    });

    t.equal(result.blockedUntil, null);
    t.equal(result.attempt, options.frequencyRate);
    t.equal(result.frequencyRate, options.frequencyRate);
    t.equal(isEqual(result.frequencyDueDate, date), true);
    t.equal(result.reason, null);

    // exceed frequency limit
    result = checker(ip);

    t.type(result.blockedUntil, Date);
    t.equal(differenceInMinutes(result.blockedUntil, date), 15);
    t.equal(result.attempt, options.frequencyRate + 1);
    t.equal(result.frequencyRate, 0);
    t.equal(isEqual(result.frequencyDueDate, date), true);
    t.equal(result.reason, 'frequency');

    // subsequent call after blocking
    result = checker(ip);

    t.type(result.blockedUntil, Date);
    t.equal(differenceInMinutes(result.blockedUntil, date), 15);
    t.equal(result.attempt, options.frequencyRate + 1);
    t.equal(result.frequencyRate, 1);
    t.equal(isEqual(result.frequencyDueDate, date), true);
    t.equal(result.reason, 'frequency');

    // wait
    clock.setSystemTime(addMinutes(new Date(), 16));
    const newDate = new Date();

    // // call 15 min later
    result = checker(ip);

    t.equal(result.blockedUntil, null);
    t.equal(result.attempt, options.frequencyRate + 2);
    t.equal(result.frequencyRate, 1);
    t.equal(
      isEqual(
        result.frequencyDueDate,
        addMilliseconds(newDate, options.frequencyTime),
      ),
      true,
    );
    t.equal(result.reason, null);

    // subsequent call
    result = checker(ip);
    t.equal(result.blockedUntil, null);
    t.equal(result.attempt, options.frequencyRate + 3);
    t.equal(result.frequencyRate, 2);
    t.equal(
      isEqual(
        result.frequencyDueDate,
        addMilliseconds(newDate, options.frequencyTime),
      ),
      true,
    );
    t.equal(result.reason, null);

    t.teardown(clock.uninstall);
    t.end();
  });

  test('should reset frequencyRate when check is not rapid', (t) => {
    const clock = fakeTimer.install({ shouldClearNativeTimers: true });
    const ip = '1.2.3.4';
    const checker = createProgressiveDelay(options);
    const date = new Date();

    let result: iCacheEntity;

    // go to threschold limit but not exceed
    Array.from({ length: options.frequencyRate }).forEach((_, i) => {
      result = checker(ip);
      t.equal(result.frequencyRate, i + 1);
    });

    t.equal(result.blockedUntil, null);
    t.equal(result.attempt, options.frequencyRate);
    t.equal(result.frequencyRate, options.frequencyRate);
    t.equal(isEqual(result.frequencyDueDate, date), true);
    t.equal(result.reason, null);

    // wait options.frequencyTime
    const newDate = addMilliseconds(date, options.frequencyTime + 1);
    clock.setSystemTime(newDate);

    // go to threschold limit but not exceed
    Array.from({ length: options.frequencyRate }).forEach((_, i) => {
      result = checker(ip);
      t.equal(result.frequencyRate, i + 1);
    });

    t.equal(result.blockedUntil, null);
    t.equal(result.attempt, options.frequencyRate * 2);
    t.equal(result.frequencyRate, options.frequencyRate);
    t.equal(
      isEqual(
        result.frequencyDueDate,
        addMilliseconds(newDate, options.frequencyTime),
      ),
      true,
    );
    t.equal(result.reason, null);

    t.teardown(clock.uninstall);
    t.end();
  });

  t.end();
});
