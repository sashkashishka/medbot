import type { onRequestHookHandler } from 'fastify';
import { RegisterError } from '../utils/errors.js';

export const checkIsAdminExists: onRequestHookHandler =
  async function checkIsAdminExists() {
    const admin = await this.prisma.admin.findMany({
      take: 1,
      skip: 0,
    });

    if (admin?.length) {
      throw new RegisterError('too-much-registrations');
    }
  };

