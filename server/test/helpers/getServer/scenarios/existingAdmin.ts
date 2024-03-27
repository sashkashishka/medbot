import type { PrismaClient } from '@prisma/client';
import { admin } from '../fixtures/admin.js';

export async function existingAdmin(prisma: PrismaClient) {
  await prisma.admin.create({
    data: admin,
  });
}
