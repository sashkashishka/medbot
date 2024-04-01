import type { Context, Scenes } from 'telegraf';
import type { calendar_v3 } from '@googleapis/calendar';
import type { Prisma } from '@prisma/client';
import type { Logger } from 'pino';
import type { ServiceApiSdk } from '../serviceApiSdk/sdk.js';

export interface iMedbotSession extends Scenes.WizardSession {
  messageThreadId?: number;
  botChatId?: number;
  order?: Pick<
    Prisma.OrderUncheckedCreateInput,
    'subscriptionEndsAt' | 'id'
  >;
}

export interface iMedbotContext extends Context {
  forumId: number;
  googleCalendar: calendar_v3.Calendar;
  googleCalendarId: string;
  webAppUrl: string;
  adminAreaUrl: string;
  serviceApiSdk: ServiceApiSdk;
  logger: Logger;

  // declare session type
  session: iMedbotSession;
  // declare scene type
  scene: Scenes.SceneContextScene<iMedbotContext, Scenes.WizardSessionData>;
  // declare wizard type
  wizard: Scenes.WizardContextWizard<iMedbotContext>;
}
