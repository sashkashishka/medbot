import type { RouteOptions } from 'fastify';
import { encryptPassword } from '../../utils/password.js';

interface iBody {
  name: string;
  password: string;
}

export const loginAdminRoute: RouteOptions = {
  method: 'POST',
  url: '/login',
  async handler(request, reply) {
    const body = request.body as iBody;

    const admin = await this.prisma.admin.findFirst({
      where: {
        name: body.name,
      },
    });

    if (
      admin.password !==
      encryptPassword(body.password, this.config.PASSWORD_SALT)
    ) {
      return reply.code(400).send({ error: 'wrong name or password' });
    }

    const token = await reply.jwtSign(
      {
        name: body.name,
      },
      { expiresIn: '1d' },
    );

    return reply
      .setCookie('token', token, { path: '/', secure: false, httpOnly: true })
      .code(200)
      .send({ done: true });
  },
};
