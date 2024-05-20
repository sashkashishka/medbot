import type { iMedbotContext } from '../../../types.js';

export function orderNotPaidMsg($t: iMedbotContext['$t']) {
  return $t.get().orderNotPaid;
}
