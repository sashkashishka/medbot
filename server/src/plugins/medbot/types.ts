import type { Context, Scenes } from 'telegraf';
import type { calendar_v3 } from '@googleapis/calendar';
import type { ServiceApiSdk } from '../serviceApiSdk/sdk.js';

export interface iMedbotSession extends Scenes.WizardSession {
  messageThreadId?: number;
  botChatId?: number;
}

export interface iMedbotContext extends Context {
  forumId: number;
  googleCalendar: calendar_v3.Calendar;
  googleCalendarId: string;
  webAppUrl: string;
  serviceApiSdk: ServiceApiSdk;

  // declare session type
  session: iMedbotSession;
  // declare scene type
  scene: Scenes.SceneContextScene<iMedbotContext, Scenes.WizardSessionData>;
  // declare wizard type
  wizard: Scenes.WizardContextWizard<iMedbotContext>;
}
