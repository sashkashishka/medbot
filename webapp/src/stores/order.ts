import { generatePath } from 'react-router-dom';

import { createApi } from '../utils/api';
import { tg } from '../utils/tg';
import { API } from '../constants/api';
import { createFetcherStore } from './fetcher';
import type { iOrder } from '../types';

const api = createApi(
  generatePath(API.ACTIVE_ORDER, { id: String(tg.initDataUnsafe.user?.id) }),
);

export const activeOrder$ = createFetcherStore<iOrder>(['active-order'], {
  fetcher: api.request<iOrder>,
});
