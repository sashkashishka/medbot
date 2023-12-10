import { generatePath } from 'react-router-dom';

import { tg } from '../utils/tg';
import { API } from '../constants/api';
import { createFetcherStore } from './fetcher';
import type { iOrder } from '../types';

const userId = String(tg.initDataUnsafe.user?.id);

export const activeOrder$ = createFetcherStore<iOrder>({
  url: generatePath(API.ACTIVE_ORDER, {
    userId,
  }),
});

export const waitingForPaymentOrder$ = createFetcherStore<iOrder>({
  url: generatePath(API.WAITING_FOR_PAYMENT_ORDER, { userId }),
});
