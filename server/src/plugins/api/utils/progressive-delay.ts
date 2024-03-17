import { addDays, addMilliseconds, addMinutes, isPast } from 'date-fns';
import { bind, compose, equals, lt, partial, prop, tap, when } from 'rambda';
import { LRUCache } from '../../../utils/lru-cache.js';

interface iOptions {
  cacheCapacity: number;
  frequencyRate: number;
  frequencyTime: number;
  maxAttempts: number;
}

export type tBlockUntilReason = 'maxAttempts' | 'frequency';

export interface iCacheEntity {
  attempt: number;
  reason: tBlockUntilReason | null;
  blockedUntil: Date | null;
  frequencyRate: number;
  frequencyDueDate: Date | null;
}

const createDefaultCacheEntity = (): iCacheEntity => ({
  attempt: 0,
  blockedUntil: null,
  reason: null,
  frequencyRate: 0,
  frequencyDueDate: new Date(),
});

// TODO show to user that exceeded limit of using this endpoint
// and show blocking time in minutes
export function createProgressiveDelay(options: iOptions) {
  const { cacheCapacity = 100 } = options;
  const cache = new LRUCache<iCacheEntity>(cacheCapacity);

  return function check(ip: string): iCacheEntity {
    const checker = compose(
      tap(partial(bind(cache.put, cache), [ip])),

      when(
        compose(
          // @ts-ignore
          lt(options.frequencyRate),
          prop('frequencyRate'),
        ),
        setFrequencyBlockage,
      ),
      incFrequency,
      when(
        compose(
          (date: iCacheEntity['frequencyDueDate']) => isPast(date),
          prop('frequencyDueDate'),
        ),
        partial(resetFrequency, [options]),
      ),
      when(
        compose(
          // @ts-ignore
          lt(options.maxAttempts),
          prop('attempt'),
        ),
        setMaxAttemptBlockage,
      ),
      when(isNotBlocked, incAttempt),
      when(canResetBlockageBy('frequency'), resetBlockageByFrequency),
      when(canResetBlockageBy('maxAttempts'), resetBlockageByMaxAttempt),
      when(equals(-1 as const), createDefaultCacheEntity),
      bind(cache.get, cache),
    );

    return checker(ip);
  };
}

function canResetBlockageBy(reason: tBlockUntilReason) {
  return function predicate(entity: iCacheEntity) {
    return (
      entity.blockedUntil instanceof Date &&
      isPast(entity.blockedUntil) &&
      entity.reason === reason
    );
  };
}

function isNotBlocked(entity: iCacheEntity) {
  return entity.blockedUntil === null && entity.reason === null;
}

function resetBlockageByMaxAttempt(entity: iCacheEntity) {
  entity.blockedUntil = null;
  entity.attempt = 0;
  entity.reason = null;
  return entity;
}

function resetBlockageByFrequency(entity: iCacheEntity) {
  entity.blockedUntil = null;
  entity.reason = null;
  return entity;
}

function incAttempt(entity: iCacheEntity) {
  entity.attempt += 1;
  return entity;
}

function setMaxAttemptBlockage(entity: iCacheEntity) {
  entity.blockedUntil = addDays(new Date(), 1);
  entity.reason = 'maxAttempts';
  return entity;
}

function setFrequencyBlockage(entity: iCacheEntity) {
  entity.blockedUntil = addMinutes(new Date(), 15);
  entity.reason = 'frequency';
  entity.frequencyRate = 0;
  return entity;
}

function resetFrequency(options: iOptions, entity: iCacheEntity) {
  entity.frequencyDueDate = addMilliseconds(new Date(), options.frequencyTime);
  entity.frequencyRate = 0;

  return entity;
}

function incFrequency(entity: iCacheEntity) {
  entity.frequencyRate += 1;

  return entity;
}
