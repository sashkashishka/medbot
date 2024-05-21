import { type MenuButton } from 'telegraf/types';
import type { iMedbotContext } from '../types.js';

export const menuButton: Record<string, (...args: any[]) => MenuButton> = {
  order(webAppUrl: string, $t: iMedbotContext['$t']): MenuButton {
    const url = `${webAppUrl}/products`;

    return {
      text: $t.get().menuButtonOrderTitle,
      type: 'web_app',
      web_app: { url },
    };
  },
  appointment(webAppUrl: string, $t: iMedbotContext['$t']): MenuButton {
    const url = `${webAppUrl}/appointment/list`;

    return {
      text: $t.get().menuButtonAppointmentTitle,
      type: 'web_app',
      web_app: { url },
    };
  },
};
