import { ReactNode } from 'react';
import { useStore } from '@nanostores/react';
import { activeOrder$ } from '../../../stores/order';
import { ErrorNoActiveOrder } from '../../ErrorStates/ErrorNoActiveOrder';

interface iProps {
  children: ReactNode | ReactNode[];
}

export function NoActiveOrderGuard({ children }: iProps) {
  const { data } = useStore(activeOrder$);

  if (!data) {
    return <ErrorNoActiveOrder />;
  }

  return children;
}

