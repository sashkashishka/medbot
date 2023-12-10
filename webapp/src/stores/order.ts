import { generatePath } from 'react-router-dom';

import { createApi } from '../utils/api';
import { tg } from '../utils/tg';
import { API } from '../constants/api';
import { createFetcherStore } from './fetcher';
import type { iOrder } from '../types';

const userId = String(tg.initDataUnsafe.user?.id);

const activeOrderApi = createApi(
  generatePath(API.ACTIVE_ORDER, {
    userId,
  }),
);

const waitingForPaymentOrderApi = createApi(
  generatePath(API.WAITING_FOR_PAYMENT_ORDER, { userId }),
);

export const activeOrder$ = createFetcherStore<iOrder>(['active-order'], {
  fetcher: activeOrderApi.request<iOrder>,
});

export const waitingForPaymentOrder$ = createFetcherStore<iOrder>(
  ['waiting-for-payment-order'],
  {
    fetcher: waitingForPaymentOrderApi.request<iOrder>,
  },
);
