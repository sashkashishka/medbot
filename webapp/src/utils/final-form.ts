import type { FieldMetaState } from 'react-final-form';

export const required =
  (error: string) =>
  <tValue>(value: tValue) =>
    value ? undefined : error;

export const email = (error: string) => (value: string) => {
  const emailRegExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegExp.test(value) ? undefined : error;
};

export const integer =
  (error: string) =>
  <tValue extends string>(value: tValue) => {
    const num = parseFloat(value);

    return typeof num === 'number' &&
      Number.isFinite(num) &&
      Math.floor(num) === num
      ? undefined
      : error;
  };

/**
 * @param {Object} meta
 * @param {String|undefined} meta.error
 * @param {String|undefined} meta.submitError
 * @param {boolean|undefined} meta.dirtySinceLastSubmit
 * @param {boolean} meta.touched
 */
export const isError = <tValue>(meta: FieldMetaState<tValue>) =>
  meta.touched &&
  (meta.error || (meta.submitError && !meta.dirtySinceLastSubmit));

/**
 * @param {Object} formState
 * @param {boolean} formState.hasSubmitErrors
 * @param {boolean} formState.submitting
 * @param {boolean} formState.dirtySinceLastSubmit
 * @param {string|undefined} formState.submitError
 */
export const isFormError = (formState) =>
  formState.hasSubmitErrors &&
  !formState.submitting &&
  !formState.dirtySinceLastSubmit &&
  formState.submitError;

/**
 * @param {Object} meta
 * @param {String|undefined} meta.submitError
 * @param {Boolean|undefined} meta.touched
 * @returns {String|boolean}
 */
export const isSubmitError = (meta) => meta.submitError && meta.touched;

type tValidateResult = string | undefined;

export const composeValidators =
  (...validators: ((value?: unknown) => tValidateResult)[]) =>
  <tValue>(value: tValue) =>
    validators.reduce(
      (error, validator) => error || validator(value),
      undefined,
    );
