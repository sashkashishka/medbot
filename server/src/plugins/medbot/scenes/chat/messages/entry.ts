import type { Prisma } from '@prisma/client';
import type { iMedbotContext } from '../../../types.js';

export function entryMsg({
  product,
  activationCodes,
  $t,
}: {
  product: Prisma.ProductUncheckedCreateInput;
  activationCodes: number[];
  $t: iMedbotContext['$t'];
}) {
  const productDetails =
    product.subscriptionDuration === 0
      ? $t.get().oneTimeProduct
      : $t.get().subscriptionProduct;

  let codes = '';

  if (activationCodes?.length) {
    codes = $t
      .get()
      .activationCodesInfo({
        activationCodes: activationCodes.map((c) => `*${c}*`).join('\n'),
      });
  }

  return $t.get().successfulPayment({
    productDetails,
    productName: product.name,
    codes,
  });
}
