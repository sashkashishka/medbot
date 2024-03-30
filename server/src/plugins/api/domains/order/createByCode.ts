import { Prisma } from '@prisma/client';
import { addMonths } from 'date-fns';
import type { RouteOptions } from 'fastify';

import { canHaveOneActiveOrderAtTime } from '../../hooks/preHandler/canHaveOneActiveOrderAtTime.js';
import { checkIfBlockedByRateLimiter } from '../../hooks/preHandler/checkIfBlockedByRateLimiter.js';
import { checkIfActivationCodeValid } from '../../hooks/preHandler/checkIfActivationCodeValid.js';
import { decorateWithActivationCode } from '../../hooks/preHandler/decorateWithActivationCode.js';
import { checkIfActivationCodeExpired } from '../../hooks/preHandler/checkIfActivationCodeExpired.js';

export const createByCode: RouteOptions = {
  method: 'POST',
  url: '/order/create/:code',
  schema: {
    body: {
      type: 'object',
      properties: {
        userId: { type: 'number' },
      },
      required: ['userId'],
    },
  },
  preHandler: [
    checkIfBlockedByRateLimiter,
    canHaveOneActiveOrderAtTime,
    decorateWithActivationCode,
    checkIfActivationCodeValid,
    checkIfActivationCodeExpired,
  ],
  async handler(req) {
    const body = req.body as Prisma.OrderUncheckedCreateInput;
    const code = req.$activationCode;

    const product = await this.prisma.product.findUnique({
      where: { id: Number(code.productId) },
    });

    let subscriptionEndsAt: string = null;

    if (product.subscriptionDuration > 0) {
      subscriptionEndsAt = addMonths(
        new Date(),
        product.subscriptionDuration,
      ).toISOString();
    }

    const order = await this.prisma.order.create({
      data: {
        ...body,
        productId: product.id,
        status: 'ACTIVE',
        subscriptionEndsAt,
        createdAt: new Date(),
      },
    });

    await this.prisma.activationCode.delete({
      where: { id: code.id },
    });

    return order;
  },
};
