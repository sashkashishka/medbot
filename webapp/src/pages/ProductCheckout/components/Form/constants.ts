import { tTranslations } from '../../../../stores/i18n';

type tOrderErrorKeys = keyof Pick<
  tTranslations,
  'orderError_hasActive' | 'orderError_cannotUpdateNotActiveOrder'
>;

export const ORDER_ERRORS: Record<string, tOrderErrorKeys> = {
  'has-active': 'orderError_hasActive',
  'cannot-update-not-active-order': 'orderError_cannotUpdateNotActiveOrder',
};
