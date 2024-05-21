import type { iMedbotContext } from '../../../types.js';

export function entryMsg($t: iMedbotContext['$t']) {
  return $t.get().entryMessage;
}
