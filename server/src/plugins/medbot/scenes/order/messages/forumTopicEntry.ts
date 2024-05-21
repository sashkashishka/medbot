import type { Prisma } from '@prisma/client';
import type { iMedbotContext } from '../../../types.js';

interface iOptions {
  linkToUserPage: string;
  product: Prisma.ProductUncheckedCreateInput;
  $t: iMedbotContext['$t'];
}

export function forumTopicEntryMsg({ $t, linkToUserPage, product }: iOptions) {
  return $t.get().forumNewOrder({
    link: linkToUserPage,
    productName: product.name,
    subscription: product.subscriptionDuration > 0 ? $t.get().yes : $t.get().no,
  });
}
