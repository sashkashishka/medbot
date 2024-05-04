import { notification } from 'antd';
import { map, onMount, onSet } from 'nanostores';
import { createFetcherStore, createMutatorStore } from './_query';
import {
  type iPaginatorResp,
  type iAppointment,
  type iUser,
  type iFreeSlot,
} from '../types';
import { createListFilters, type iPagination } from './_list-filters';
import {
  $tgCompleteAppointment,
  $tgDeleteAppointment,
  $tgUpdateAppointment,
} from './bot';

export const APPOINTMENT_PAGE_SIZE = 20;

export interface iAppointmentListFilters extends iPagination {
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
  list: 'appointment/list',
  filteredList() {
    return [this.list, $appointmentListFilterQuery];
  },
  freeSlots: ['appointment/free-slots'],
};

export const $appointments = createFetcherStore<iPaginatorResp<iAppointment>>(
  APPOINTMENT_KEYS.filteredList(),
);

// NOTE:
// there is an issue with switching between timezones
// the task is simple - just format date to specific timezone
// but date-fns cannot receive timezone as argument (instead of native Intl obj)
// and ReactScheduleMeeting hugely depends on date-fns
// providing custom locale will not help because it just
// provides templates for formatting
export const $appointmentFreeSlots = createFetcherStore<iFreeSlot[]>(
  APPOINTMENT_KEYS.freeSlots,
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

export const $editAppointment = createMutatorStore<iAppointment>(
  ({ data, invalidate }) => {
    invalidate((k) => Boolean(k.match(APPOINTMENT_KEYS.list)));

    return fetch(`/api/admin/appointment/${data.id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: { 'content-type': 'application/json' },
    });
  },
);

export const $prescriptAppointment = createMutatorStore<iAppointment>(
  ({ data, invalidate }) => {
    invalidate((k) => Boolean(k.match(APPOINTMENT_KEYS.list)));

    return fetch(`/api/admin/appointment/prescript/${data.id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: { 'content-type': 'application/json' },
    });
  },
);

export const $deleteAppointment = createMutatorStore<iAppointment>(
  ({ data, invalidate }) => {
    invalidate((k) => Boolean(k.match(APPOINTMENT_KEYS.list)));

    return fetch(`/api/admin/appointment/${data.id}`, {
      method: 'DELETE',
      body: '{}',
      headers: { 'content-type': 'application/json' },
    });
  },
);

// =====================
// =====================
// ACTIONS
// =====================
// =====================

export async function completeAppointment({
  appointment,
  user,
}: {
  appointment: iAppointment;
  user: iUser;
}): Promise<boolean> {
  try {
    const resp = (await $editAppointment.mutate({
      ...appointment,
      status: 'DONE',
    })) as Response;

    if (resp.ok) {
      await $tgCompleteAppointment.mutate({
        botChatId: user?.botChatId!,
        userId: user?.id!,
      });
      notification.success({ message: 'Appointment completed!' });
      return true;
    }

    const respData = await resp.json();

    if ('error' in respData && typeof respData.error === 'string') {
      notification.error({ message: respData.error });
      return false;
    }

    throw respData;
  } catch (e) {
    console.error(e);
    notification.error({
      message: 'Unexpected error completing appointment',
    });

    return false;
  }
}

export async function changeAppointmentTime({
  appointment,
  user,
}: {
  appointment: iAppointment;
  user: iUser;
}) {
  try {
    const resp = (await $editAppointment.mutate(appointment)) as Response;

    if (resp.ok) {
      await $tgUpdateAppointment.mutate({
        botChatId: user?.botChatId!,
        userId: user?.id!,
      });
      notification.success({ message: 'Appointment time changed!' });
      return true;
    }

    const respData = await resp.json();

    if ('error' in respData && typeof respData.error === 'string') {
      notification.error({ message: respData.error });
      return false;
    }

    throw respData;
  } catch (e) {
    console.error(e);
    notification.error({
      message: 'Unexpected error changing appointment time',
    });

    return false;
  }
}

export async function deleteAppointment({
  appointment,
  user,
}: {
  appointment: iAppointment;
  user: iUser;
}) {
  try {
    const resp = (await $deleteAppointment.mutate(appointment)) as Response;

    if (resp.ok) {
      await $tgDeleteAppointment.mutate({
        userId: user?.id!,
        botChatId: user?.botChatId!,
      });
      notification.success({ message: 'Appointment deleted' });
      return true;
    }

    const respData = await resp.json();

    if ('error' in respData && typeof respData.error === 'string') {
      notification.error({ message: respData.error });
      return false;
    }

    throw respData;
  } catch (e) {
    console.error(e);
    notification.error({
      message: 'Unexpected error deleting appointment',
    });

    return false;
  }
}
