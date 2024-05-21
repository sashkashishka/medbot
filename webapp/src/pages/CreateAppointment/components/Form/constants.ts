import { tTranslations } from '../../../../stores/i18n';

export const APPOINTMENT_ERRORS: Record<string, keyof tTranslations> = {
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
