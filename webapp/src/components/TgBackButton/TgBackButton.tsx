import { useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tg } from '../../utils/tg';

export function TgBackButton() {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    tg.BackButton.show();

    tg.BackButton.onClick(() => navigate(-1));

    return () => {
      tg.BackButton.hide();
    };
  }, [navigate]);

  return null;
}
