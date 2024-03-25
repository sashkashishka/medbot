import type { RouteOptions } from 'fastify';
import { encryptPassword } from '../../utils/password.js';
import { isOneRegistration } from '../../hooks/onRequest/isOneRegistration.js';

interface iBody {
  name: string;
  password: string;
}

export const registerAdminRoute: RouteOptions = {
  method: 'POST',
  url: '/register',
  onRequest: [isOneRegistration],
  async handler(request, reply) {
    const body = request.body as iBody;

    const admin = await this.prisma.admin.create({
      data: {
        name: body.name,
        password: encryptPassword(body.password, this.config.PASSWORD_SALT),
      },
    });

    const token = await reply.jwtSign(
      {
        id: admin.id,
        name: admin.name,
      },
      { expiresIn: '1d' },
    );

    return reply
      .setCookie('token', token, {
        path: '/',
        secure: false,
        httpOnly: true,
        signed: false,
      })
      .code(200)
      .send({ done: true });
  },
};
