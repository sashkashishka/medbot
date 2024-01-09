import { generatePath } from 'react-router-dom';

import { API } from '../constants/api';
import { createFetcherStore } from './fetcher';
import { iFreeSlot, type iAppointment } from '../types';
import { getUserId } from '../utils/tg';

const userId = String(getUserId());

export const activeAppointment$ = createFetcherStore<iAppointment>({
  url: generatePath(API.ACTIVE_APPOINTMENT, {
    userId,
  }),
});

export const freeSlots$ = createFetcherStore<iFreeSlot[]>({
  url: API.FREE_SLOTS,
});
