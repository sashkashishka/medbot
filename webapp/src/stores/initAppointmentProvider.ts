import { computed } from 'nanostores';
import { user$ } from './user';
import { activeOrder$ } from './order';
import { activeAppointment$ } from './appointment';

export const initAppointmentProviderStore$ = computed(
  [user$, activeOrder$, activeAppointment$],
  (userQuery, activeOrderQuery, activeAppointmentQuery) => {
    return {
      loading:
        userQuery.loading ||
        activeOrderQuery.loading ||
        activeAppointmentQuery.loading,
      error:
        userQuery.error ||
        activeOrderQuery.error ||
        activeAppointmentQuery.error,
      fetched:
        userQuery.fetched &&
        activeOrderQuery.fetched &&
        activeAppointmentQuery.fetched,
    };
  },
);
