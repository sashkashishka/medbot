import type { Context, Scenes } from 'telegraf';
import type { calendar_v3 } from '@googleapis/calendar';
import type { Prisma } from '@prisma/client';
import type { Logger } from 'pino';
import type { Messages } from '@nanostores/i18n';
import type { ServiceApiSdk } from '../serviceApiSdk/sdk.js';
import type { tTranslationBases } from '../i18n/i18n.js';

export interface iMedbotSession extends Scenes.WizardSession {
  messageThreadId?: number;
  botChatId?: number;
  user?: Prisma.UserUncheckedCreateInput;
  order?: Prisma.OrderUncheckedCreateInput;
}

export interface iMedbotContext extends Context {
  forumId: number;
  googleEmail: string;
  googleCalendar: calendar_v3.Calendar;
  googleCalendarId: string;
  webAppUrl: string;
  adminAreaUrl: string;
  serviceApiSdk: ServiceApiSdk;
  logger: Logger;
  $t: Messages<tTranslationBases['medbot']>;

  // declare session type
  session: iMedbotSession;
  // declare scene type
  scene: Scenes.SceneContextScene<iMedbotContext, Scenes.WizardSessionData>;
  // declare wizard type
  wizard: Scenes.WizardContextWizard<iMedbotContext>;
}
