import { useStore } from '@nanostores/react';

import { $activeAppointment } from '../../stores/appointment';
import { $activeOrder } from '../../stores/order';

import { CreateAppointmentForm } from './components/Form';

export function CreateAppointmentPage() {
  const { data: activeAppointment } = useStore($activeAppointment);
  const { data: activeOrder } = useStore($activeOrder);

  return (
    <CreateAppointmentForm
      activeAppointment={activeAppointment}
      activeOrder={activeOrder!}
    />
  );
}
