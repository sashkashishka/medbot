import { createFetcherStore } from './_query';
import type { iPaginatorResp, iAppointment } from '../types';
import { createListFilters, type iPagination } from './_list-filters';

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
