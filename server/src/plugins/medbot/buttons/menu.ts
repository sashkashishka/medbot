import { type MenuButton } from 'telegraf/types';

export const menuButton: Record<string, (...args: any[]) => MenuButton> = {
  order(webAppUrl: string): MenuButton {
    const url = `${webAppUrl}/products`;

    return {
      text: 'Замовити',
      type: 'web_app',
      web_app: { url },
    };
  },
  appointment(webAppUrl: string): MenuButton {
    const url = `${webAppUrl}/appointment/list`;

    return {
      text: 'Запис',
      type: 'web_app',
      web_app: { url },
    };
  },
};
