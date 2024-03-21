import { createFetcherStore } from './_query';
import type { iPaginatorResp, iAppointment } from '../types';
import { createPaginator } from './_paginator';

export const APPOINTMENT_PAGE_SIZE = 20;

export const { $pageParams, setPage: setAppointmentListPage } = createPaginator(
  APPOINTMENT_PAGE_SIZE,
);

export const APPOINTMENT_KEYS = {
  appointmentList: ['appointment', 'list', $pageParams],
};

export const $appointments = createFetcherStore<iPaginatorResp<iAppointment>>(
  APPOINTMENT_KEYS.appointmentList,
);
