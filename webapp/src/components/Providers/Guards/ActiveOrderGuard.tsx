import type { ReactNode } from 'react';
import { useStore } from '@nanostores/react';
import { $activeOrder } from '../../../stores/order';
import { ErrorActiveOrder } from '../../ErrorStates/ErrorActiveOrder';

interface iProps {
  children: ReactNode | ReactNode[];
}

export function ActiveOrderGuard({ children }: iProps) {
  const { data } = useStore($activeOrder);

  if (data) {
    return <ErrorActiveOrder />;
  }

  return children;
}
