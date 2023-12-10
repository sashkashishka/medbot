import { generatePath } from 'react-router-dom';
import { getUserId } from '../utils/tg';
import { API } from '../constants/api';
import type { iUser } from '../types';
import { createFetcherStore } from './fetcher';

const userId = String(getUserId());

export const user$ = createFetcherStore<iUser>({
  url: generatePath(API.USER, { userId }),
});
