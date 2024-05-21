import { generatePath } from 'react-router-dom';

import { API } from '../constants/api';
import { createFetcherStore } from './fetcher';
import type { iConfig } from '../types';

export const { store: $config } = createFetcherStore<iConfig>({
  url: generatePath(API.CONFIG),
});
