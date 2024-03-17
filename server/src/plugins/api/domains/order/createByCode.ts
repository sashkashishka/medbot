import { Prisma } from '@prisma/client';
import { addMonths } from 'date-fns';
import type { RouteOptions } from 'fastify';
import { OrderError } from '../../utils/errors.js';
import {
  createProgressiveDelay,
  type iCacheEntity,
} from '../../utils/progressive-delay.js';

declare module 'fastify' {
  // eslint-disable-next-line
  export interface FastifyRequest {
    $activationCode?: Prisma.ActivationCodeUncheckedCreateInput;
  }
}

interface iParams {
  code: string;
}

let limiter: ReturnType<typeof createProgressiveDelay>;

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
  async preHandler(req) {
    if (!limiter) {
      limiter = createProgressiveDelay({
        cacheCapacity: 100,
        frequencyRate: 3,
        frequencyTime: 8000,
        maxAttempts: 20,
      });
    }

    // TODO check that proper ip is passed. not proxy ip
    const checkResult = limiter(req.ip);

    if (checkResult.blockedUntil) {
      throw new OrderError<Pick<iCacheEntity, 'blockedUntil' | 'reason'>>(
        'too-many-requests',
        { blockedUntil: checkResult.blockedUntil, reason: checkResult.reason },
      );
    }

    const body = req.body as Prisma.OrderUncheckedCreateInput;

    const orders = await this.prisma.order.findMany({
      where: {
        userId: body.userId,
        status: 'ACTIVE',
      },
    });

    if (orders.length) {
      throw new OrderError('has-active');
    }

    const params = req.params as iParams;

    const code = await this.prisma.activationCode.findFirst({
      where: {
        code: Number(params.code),
      },
    });

    if (!code) {
      throw new OrderError('invalid-activation-code');
    }

    req.$activationCode = code;
  },
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
