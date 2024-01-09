import { useStore } from '@nanostores/react';

import { activeAppointment$ } from '../../stores/appointment';
import { CreateAppointmentForm } from './components/Form';

export function CreateAppointmentPage() {
  const { data } = useStore(activeAppointment$);

  return <CreateAppointmentForm activeAppointment={data} />;
}
