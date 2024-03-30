import { type FastifyInstance } from 'fastify';
import { type iOptions } from './index.js';
import { admin } from '../fixtures/admin.js';

export async function existingAdmin(
  _fastify: FastifyInstance,
  request: iOptions<any>['request'],
) {
  await request('/api/auth/admin/register', { method: 'POST', body: admin });
}
