import { type PrismaClient } from '@prisma/client';
import { common } from './common.js';
import { existingAdmin } from './existingAdmin.js';

const SCENARIOS = {
  existingAdmin,
};

export type tScenario = keyof typeof SCENARIOS;

export async function applyScenario(
  prisma: PrismaClient,
  scenarios: Array<tScenario> = [],
) {
  await common(prisma);
  return Promise.all(scenarios.map((v) => SCENARIOS[v](prisma)));
}
