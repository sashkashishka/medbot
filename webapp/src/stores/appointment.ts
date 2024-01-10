import { generatePath } from 'react-router-dom';
import addHours from 'date-fns/addHours';

import { API } from '../constants/api';
import { createFetcherStore } from './fetcher';
import { iFreeSlot, type iAppointment } from '../types';
import { getUserId } from '../utils/tg';
import { computed } from 'nanostores';

const userId = String(getUserId());

export const { store: activeAppointment$, refetch: refetchActiveAppointment } =
  createFetcherStore<iAppointment>({
    url: generatePath(API.ACTIVE_APPOINTMENT, {
      userId,
    }),
  });

export const { store: freeSlots$, refetch: refetchFreeSlots } =
  createFetcherStore<iFreeSlot[]>({
    url: API.FREE_SLOTS,
  });

export const availableTimeslots$ = computed(
  [freeSlots$, activeAppointment$],
  ({ data: freeSlots }, { data: activeAppointment }) => {
    if (!freeSlots) return [];

    if (!activeAppointment) return freeSlots;

    const { time } = activeAppointment;

    const endTime = addHours(new Date(time), 1);

    return freeSlots.concat({
      id: time,
      startTime: time,
      endTime: endTime.toISOString(),
    });
  },
);
