import { type FastifyInstance } from 'fastify';
import { type iOptions } from './index.js';
import { admin as adminFixture } from '../fixtures/admin.js';

export async function admin(
  _fastify: FastifyInstance,
  request: iOptions<any>['request'],
) {
  await request('/api/auth/admin/register', {
    method: 'POST',
    body: adminFixture,
  });
}
