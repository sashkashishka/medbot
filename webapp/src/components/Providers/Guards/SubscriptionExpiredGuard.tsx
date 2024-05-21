import type { ReactNode } from 'react';
import { useStore } from '@nanostores/react';
import { ErrorOrderExpired } from '../../ErrorStates/ErrorOrderExpired';
import { $activeAppointment } from '../../../stores/appointment';

interface iProps {
  children: ReactNode | ReactNode[];
}

export function SubscriptionExpiredGuard({ children }: iProps) {
  const { data } = useStore($activeAppointment);

  if ('message' in (data || {})) {
    return <ErrorOrderExpired />;
  }

  return children;
}
