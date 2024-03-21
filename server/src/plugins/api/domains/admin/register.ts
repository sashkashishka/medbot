import type { RouteOptions } from 'fastify';
import { RegisterError } from '../../utils/errors.js';
import { encryptPassword } from '../../utils/password.js';

interface iBody {
  name: string;
  password: string;
}

export const registerAdminRoute: RouteOptions = {
  method: 'POST',
  url: '/register',
  async onRequest() {
    const admin = await this.prisma.admin.findMany({
      take: 1,
      skip: 0,
    });

    if (admin?.length) {
      throw new RegisterError('too-much-registrations');
    }
  },
  async handler(request) {
    const body = request.body as iBody;

    return this.prisma.admin.create({
      data: {
        name: body.name,
        password: encryptPassword(body.password, this.config.PASSWORD_SALT),
      },
      select: {
        name: true,
      },
    });
  },
};
