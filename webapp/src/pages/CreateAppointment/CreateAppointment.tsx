import { useStore } from '@nanostores/react';

import { $activeAppointment } from '../../stores/appointment';
import { $activeOrder } from '../../stores/order';
import { type iAppointment } from '../../types';
import { $t } from '../../stores/i18n';

import { CreateAppointmentForm } from './components/Form';

export function CreateAppointmentPage() {
  const { data: activeAppointment } = useStore($activeAppointment);
  const { data: activeOrder } = useStore($activeOrder);
  const t = useStore($t);

  return (
    <CreateAppointmentForm
      t={t}
      activeAppointment={activeAppointment! as iAppointment}
      activeOrder={activeOrder!}
    />
  );
}
