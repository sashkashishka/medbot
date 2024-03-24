import { createFetcherStore } from './_query';
import type { iPaginatorResp, iAppointment } from '../types';
import { createListFilters, type iPagination } from './_list-filters';

export const APPOINTMENT_PAGE_SIZE = 20;

interface iAppointmentListFilters extends iPagination {
  date_sort: 'asc' | 'desc';
  status?: iAppointment['status'];
}

const defaultAppointmentListFilters: iAppointmentListFilters = {
  skip: 0,
  take: APPOINTMENT_PAGE_SIZE,
  date_sort: 'desc',
  status: undefined,
};

export const {
  $listFilters: $appointmentListFilters,
  $listFilterQuery: $appointmentListFilterQuery,
  setListFilter: setAppointmentListFilter,
  resetListFilter: resetAppointmentListFilter,
  setPage: setAppointmentListPage,
} = createListFilters(defaultAppointmentListFilters);

export const APPOINTMENT_KEYS = {
  appointmentList: ['appointment/list', $appointmentListFilterQuery],
};

export const $appointments = createFetcherStore<iPaginatorResp<iAppointment>>(
  APPOINTMENT_KEYS.appointmentList,
);
