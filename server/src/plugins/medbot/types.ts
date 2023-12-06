import type { PrismaClient } from '@prisma/client';
import type { Context, Scenes } from 'telegraf';

export interface iMedbotSession extends Scenes.WizardSession {}

export interface iMedbotContext extends Context {
  prisma: PrismaClient;

  // declare session type
  session: iMedbotSession;
  // declare scene type
  scene: Scenes.SceneContextScene<iMedbotContext, Scenes.WizardSessionData>;
  // declare wizard type
  wizard: Scenes.WizardContextWizard<iMedbotContext>;
}
