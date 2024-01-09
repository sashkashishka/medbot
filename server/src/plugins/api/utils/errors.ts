export type tAppointmentErrorReason =
  | 'too-early'
  | 'occupied'
  | 'has-active'
  | 'out-of-working-hours'
  | 'cannot-delete-not-active-appointment'
  | 'cannot-update-not-active-appointment'
  | 'one-time-order-cannot-create-twice';

export function create400Response<tData>(data: tData) {
  return {
    code: 400,
    error: data,
  };
}

export class AppointmentError {
  constructor(public reason: tAppointmentErrorReason) {}

  get description() {
    switch (this.reason) {
      case 'too-early':
      case 'out-of-working-hours':
      case 'has-active':
      case 'occupied': {
        return create400Response({ time: this.reason });
      }

      case 'cannot-delete-not-active-appointment':
      case 'cannot-update-not-active-appointment':
      case 'one-time-order-cannot-create-twice':
      default: {
        return create400Response({ reason: this.reason });
      }
    }
  }
}
