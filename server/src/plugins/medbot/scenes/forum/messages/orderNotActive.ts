import type { iMedbotContext } from '../../../types.js';

export function orderNotActiveMsg($t: iMedbotContext['$t']) {
  return $t.get().forumOrderNotActive;
}
