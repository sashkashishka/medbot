import { computed } from 'nanostores';
import { createFetcherStore } from './_query';
import type { iAdmin, iAdminConfig } from '../types';

export const ADMIN_KEYS = {
  admin: ['admin'],
  adminConfig: ['config'],
};

export const $admin = createFetcherStore<iAdmin>(ADMIN_KEYS.admin);

export const $isLoggedIn = computed($admin, (admin) => !admin.error);

export const $adminConfig = createFetcherStore<iAdminConfig>(
  ADMIN_KEYS.adminConfig,
);
