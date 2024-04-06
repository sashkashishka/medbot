import { computed } from 'nanostores';
import { generatePath } from 'react-router-dom';
import { isBefore, addHours } from 'date-fns';

import { API } from '../constants/api';
import { createFetcherStore } from './fetcher';
import { iFreeSlot, type iAppointment } from '../types';
import { getUserId } from '../utils/tg';
import { $activeOrder } from './order';

const userId = String(getUserId());

export const { store: $activeAppointment, refetch: refetchActiveAppointment } =
  createFetcherStore<iAppointment | { message: string }>({
    url: generatePath(API.ACTIVE_APPOINTMENT, {
      userId,
    }),
  });

export const { store: $freeSlots, refetch: refetchFreeSlots } =
  createFetcherStore<iFreeSlot[]>({
    url: API.FREE_SLOTS,
  });

export const $freeSlotsFiltered = computed(
  [$freeSlots, $activeOrder],
  ({ data: freeSlots }, { data: activeOrder }) => {
    if (!freeSlots) return [];

    if (!activeOrder?.subscriptionEndsAt) return freeSlots;

    const { subscriptionEndsAt } = activeOrder;

    return freeSlots.filter((slot) =>
      isBefore(new Date(slot.startTime), new Date(subscriptionEndsAt)),
    );
  },
);

export const $availableTimeslots = computed(
  [$freeSlotsFiltered, $activeAppointment],
  (freeSlotsFiltered, { data: activeAppointment }) => {
    if (!freeSlotsFiltered) return [];

    if (!activeAppointment) return freeSlotsFiltered;

    if ('message' in activeAppointment) return freeSlotsFiltered;

    const { time } = activeAppointment;

    const endTime = addHours(new Date(time), 1);

    return freeSlotsFiltered.concat({
      id: time,
      startTime: time,
      endTime: endTime.toISOString(),
    });
  },
);
