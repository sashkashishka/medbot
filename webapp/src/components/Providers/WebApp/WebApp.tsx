import { type ReactNode, useEffect } from 'react';
import { getInitData, tg } from '../../../utils/tg';
import { ErrorOpenViaTelegram } from '../../ErrorStates/ErrorOpenViaTelegram';

interface iProps {
  children: ReactNode | ReactNode[];
}

export function WebAppProvider({ children }: iProps) {
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

  if (!getInitData()) {
    return <ErrorOpenViaTelegram />;
  }

  return children;
}
