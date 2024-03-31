import type { onRequestHookHandler } from 'fastify';
import { RegisterError } from '../utils/errors.js';

export const checkIsAdminExists: onRequestHookHandler =
  async function checkIsAdminExists() {
    const count = await this.prisma.admin.count({
      take: 1,
      skip: 0,
    });

    if (count > 0) {
      throw new RegisterError('too-much-registrations');
    }
  };
