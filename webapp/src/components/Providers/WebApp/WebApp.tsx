import { type ReactNode, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { getInitData, tg } from '../../../utils/tg';
import { $config } from '../../../stores/config';
import { ErrorOpenViaTelegram } from '../../ErrorStates/ErrorOpenViaTelegram';
import { Loader } from '../../Loader';

interface iProps {
  children: ReactNode | ReactNode[];
}

export function WebAppProvider({ children }: iProps) {
  const { loading } = useStore($config);

  useEffect(() => {
    tg.expand();
    tg.enableClosingConfirmation();

    const forceHideButtons = () => {
      tg?.MainButton?.hide();
      tg?.BackButton?.hide();
    };

    window.addEventListener('beforeunload', forceHideButtons);
    return () => window.removeEventListener('beforeunload', forceHideButtons);
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!getInitData()) {
    return <ErrorOpenViaTelegram />;
  }

  return children;
}
