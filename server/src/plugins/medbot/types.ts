import type { PrismaClient } from '@prisma/client';
import type { Context, Scenes } from 'telegraf';

export interface iMedbotSession extends Scenes.WizardSession {
  messageThreadId?: number;
  botChatId?: number;
}

export interface iMedbotContext extends Context {
  prisma: PrismaClient;
  forumId: string;

  // declare session type
  session: iMedbotSession;
  // declare scene type
  scene: Scenes.SceneContextScene<iMedbotContext, Scenes.WizardSessionData>;
  // declare wizard type
  wizard: Scenes.WizardContextWizard<iMedbotContext>;
}
