import { type ReactNode, useEffect } from 'react';
import { getInitData, tg } from '../../../utils/tg';
import { ErrorOpenViaTelegram } from '../../ErrorStates';

interface iProps {
  children: ReactNode | ReactNode[];
}

export function WebAppProvider({ children }: iProps) {
  useEffect(() => {
    const forceHideButtons = () => {
      tg?.MainButton?.hide();
      tg?.BackButton?.hide();
    };

    window.addEventListener('beforeunload', forceHideButtons);
    return () => window.removeEventListener('beforeunload', forceHideButtons);
  }, []);

  if (!getInitData()) {
    return <ErrorOpenViaTelegram />
  }

  return children;
}
