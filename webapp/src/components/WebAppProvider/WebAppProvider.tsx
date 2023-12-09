import { type ReactNode, useEffect } from 'react';
import { tg } from '../../utils/tg';

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

  return children;
}
