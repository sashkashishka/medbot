import { type ReactNode } from 'react';
import { useStore } from '@nanostores/react';
import { $t, i18n } from '../../../stores/i18n';
import { Loader } from '../../Loader';

interface iProps {
  children: ReactNode | ReactNode[];
}

export function I18nProvider({ children }: iProps) {
  useStore($t);
  const isLoading = useStore(i18n.loading);

  if (isLoading) {
    return <Loader />;
  }

  return children;
}
