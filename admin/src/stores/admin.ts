import { computed } from "nanostores";
import { createFetcherStore } from "./_query";
import type { iAdmin } from "../types";

export const ADMIN_KEYS = {
  admin: ['admin']
}

export const $admin = createFetcherStore<iAdmin>(ADMIN_KEYS.admin);

export const $isLoggedIn = computed($admin, (admin) => Boolean(admin.data?.name))
