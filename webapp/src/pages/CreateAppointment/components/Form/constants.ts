import { tTranslations } from '../../../../stores/i18n';

type tAppointmentErrorKey = keyof Pick<
  tTranslations,
  | 'appointmentError_tooEarly'
  | 'appointmentError_occupied'
  | 'appointmentError_hasActive'
  | 'appointmentError_cannotCreateAppointmentBehindOrderExpirationDate'
  | 'appointmentError_oneTimeOrderCannotCreateTwice'
  | 'appointmentError_outOfWorkingHours'
  | 'appointmentError_cannotDeleteNotActiveAppointment'
  | 'appointmentError_cannotUpdateNotActiveAppointment'
>;

export const APPOINTMENT_ERRORS: Record<string, tAppointmentErrorKey> = {
  'too-early': 'appointmentError_tooEarly',
  occupied: 'appointmentError_occupied',
  'has-active': 'appointmentError_hasActive',
  'cannot-create-appointment-behind-order-expiration-date':
    'appointmentError_cannotCreateAppointmentBehindOrderExpirationDate',
  'out-of-working-hours': 'appointmentError_outOfWorkingHours',
  'cannot-delete-not-active-appointment':
    'appointmentError_cannotDeleteNotActiveAppointment',
  'cannot-update-not-active-appointment':
    'appointmentError_cannotUpdateNotActiveAppointment',
  'one-time-order-cannot-create-twice':
    'appointmentError_oneTimeOrderCannotCreateTwice',
};
