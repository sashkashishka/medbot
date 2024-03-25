import { createFetcherStore } from './_query';
import type { iPaginatorResp, iAppointment } from '../types';
import { createListFilters, type iPagination } from './_list-filters';
import { map, onMount, onSet } from 'nanostores';

export const APPOINTMENT_PAGE_SIZE = 20;

interface iAppointmentListFilters extends iPagination {
  date_sort: 'asc' | 'desc';
  user_id?: string;
  status?: iAppointment['status'];
}

const defaultAppointmentListFilters: iAppointmentListFilters = {
  page: 1,
  date_sort: 'desc',
  user_id: undefined,
  status: undefined,
};

export const {
  $listFilters: $appointmentListFilters,
  $listFilterQuery: $appointmentListFilterQuery,
  setListFilter: setAppointmentListFilter,
  resetListFilter: resetAppointmentListFilter,
} = createListFilters(defaultAppointmentListFilters, {
  take: APPOINTMENT_PAGE_SIZE,
});

export const APPOINTMENT_KEYS = {
  appointmentList: ['appointment/list', $appointmentListFilterQuery],
};

export const $appointments = createFetcherStore<iPaginatorResp<iAppointment>>(
  APPOINTMENT_KEYS.appointmentList,
);

export function createAppointmentDetailsFormPersister(
  appointment: iAppointment,
) {
  const $store = map<iAppointment>(appointment);
  const LS_KEY = `appointment-details-form-${appointment.id}`;

  onMount($store, () => {
    try {
      const item = sessionStorage.getItem(LS_KEY);
      if (item) {
        const values = JSON.parse(item);

        $store.set(values);
      }
    } catch (e) {
      console.error(e);
    }

    return () => {};
  });

  onSet($store, ({ newValue }) => {
    try {
      sessionStorage.setItem(LS_KEY, JSON.stringify(newValue));
    } catch (e) {
      console.error(e);
    }
  });

  return {
    $store,
    persistValues(v: iAppointment) {
      $store.set(v);
    },
  };
}
