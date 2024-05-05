import type { RouteOptions } from 'fastify';

interface iBody {
  key: string;
}

export const deleteTranslationRoute: RouteOptions = {
  method: 'DELETE',
  url: '/i18n/delete',
  schema: {
    body: {
      type: 'object',
      properties: {
        key: { type: 'string' },
      },
    },
  },
  handler(req) {
    const { key } = req.body as iBody;

    return this.prisma.i18n.delete({
      where: { key },
    });
  },
};
