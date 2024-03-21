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
        return create400Response({ error: this.reason });
      }
    }
  }
}

export type tOrderErrorReason =
  | 'has-active'
  | 'cannot-update-not-active-order'
  | 'invalid-activation-code'
  | 'too-many-requests';

export class OrderError<tPayload = unknown> {
  constructor(
    public reason: tOrderErrorReason,
    private payload: tPayload = undefined,
  ) {}

  get description() {
    switch (this.reason) {
      case 'too-many-requests': {
        return create400Response(this.payload);
      }

      case 'has-active':
      default: {
        return create400Response({ error: this.reason });
      }
    }
  }
}

export type tRegisterErrorReason = 'too-much-registrations';

export class RegisterError<tRegisterErrorReason> {
  constructor(public reason: tRegisterErrorReason) {}

  get description() {
    switch (this.reason) {
      case 'too-much-registrations':
      default: {
        return create400Response(this.reason);
      }
    }
  }
}
