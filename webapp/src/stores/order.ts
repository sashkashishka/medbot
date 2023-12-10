import { generatePath } from 'react-router-dom';

import { getUserId } from '../utils/tg';
import { API } from '../constants/api';
import { createFetcherStore } from './fetcher';
import type { iOrder } from '../types';

const userId = String(getUserId());

export const activeOrder$ = createFetcherStore<iOrder>({
  url: generatePath(API.ACTIVE_ORDER, {
    userId,
  }),
});

export const createWaitingForPaymentOrder = (productId: string) => () =>
  createFetcherStore<iOrder>({
    url: generatePath(API.WAITING_FOR_PAYMENT_ORDER, { userId, productId }),
  });
