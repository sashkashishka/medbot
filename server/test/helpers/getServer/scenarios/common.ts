import type { PrismaClient } from '@prisma/client';
import { products } from '../fixtures/products.js';

export async function common(prisma: PrismaClient) {
  await prisma.product.createMany({
    data: products,
  });
}
