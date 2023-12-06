import type { RouteOptions } from 'fastify';

interface iAddProductBody {
  name: string;
  description: string;
  price: number;
  memberQty: number;
  subscriptionDuration: number;
}

const product = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    description: { type: 'string' },
    price: { type: 'number' },
    memberQty: { type: 'number' },
    subscriptionDuration: { type: 'number' },
  },
  required: [
    'name',
    'description',
    'price',
    'memberQty',
    'subscriptionDuration',
  ],
};

export const addProductRoute: RouteOptions = {
  method: 'POST',
  url: '/product/add',
  schema: {
    body: {
      type: 'array',
      items: product,
    },
  },
  handler(req) {
    const body = req.body as iAddProductBody[];

    return this.prisma.product.createMany({
      data: body,
    });
  },
};


