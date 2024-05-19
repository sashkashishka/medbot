import type { RouteOptions } from 'fastify';

interface iBody {
  id: number;
}

export const deleteTranslationRoute: RouteOptions = {
  method: 'DELETE',
  url: '/i18n/delete',
  schema: {
    body: {
      type: 'object',
      properties: {
        id: { type: 'number' },
      },
    },
  },
  handler(req) {
    const { id } = req.body as iBody;

    return this.prisma.i18n.delete({
      where: { id },
    });
  },
};
