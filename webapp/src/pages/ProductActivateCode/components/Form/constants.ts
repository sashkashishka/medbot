import type { tTranslations } from '../../../../stores/i18n';

type tOrderErrorKeys = keyof Pick<
  tTranslations,
  | 'orderError_hasActive'
  | 'orderError_invalidActivationCode'
  | 'orderError_codeExpired'
>;

export const ORDER_ERRORS: Record<string, tOrderErrorKeys> = {
  'has-active': 'orderError_hasActive',
  'invalid-activation-code': 'orderError_invalidActivationCode',
  'code-expired': 'orderError_codeExpired',
};

type tBlockReasonKeys = keyof Pick<
  tTranslations,
  'blockReason_frequency' | 'blockReason_maxAttempts'
>;

export const BLOCK_REASON: Record<string, tBlockReasonKeys> = {
  maxAttempts: 'blockReason_maxAttempts',
  frequency: 'blockReason_frequency',
};
