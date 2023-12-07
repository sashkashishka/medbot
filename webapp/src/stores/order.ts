import { createApi } from '../utils/api';
import { API } from '../constants/api';
import { createFetcherStore } from './fetcher';
import type { iOrder } from '../types';

const api = createApi(API.ACTIVE_ORDER);

export const activeOrder$ = createFetcherStore<iOrder>(['active-order'], {
  fetcher: api.request<iOrder>,
});
