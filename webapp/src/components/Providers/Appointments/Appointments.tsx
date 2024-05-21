import { type ReactNode, useLayoutEffect } from 'react';
import { useStore } from '@nanostores/react';
import { tg } from '../../../utils/tg';
import { $initAppointmentProviderStore } from '../../../stores/initAppointmentProvider';
import { ErrorInit } from '../../ErrorStates/ErrorInit';
import { NoActiveOrderGuard } from '../Guards/NoActiveOrderGuard';
import { Loader } from '../../Loader';
import { SubscriptionExpiredGuard } from '../Guards/SubscriptionExpiredGuard';

interface iProps {
  children: ReactNode | ReactNode[];
}

export function AppointmentProvider({ children }: iProps) {
  const initQuery = useStore($initAppointmentProviderStore);

  useLayoutEffect(() => {
    if (initQuery.fetched) {
      tg.ready();
    }
  }, [initQuery.fetched]);

  if (initQuery.loading) {
    return <Loader />;
  }

  if (initQuery.error) {
    return <ErrorInit emoji="astonished" />;
  }

  return (
    <SubscriptionExpiredGuard>
      <NoActiveOrderGuard>{children}</NoActiveOrderGuard>
    </SubscriptionExpiredGuard>
  );
}
