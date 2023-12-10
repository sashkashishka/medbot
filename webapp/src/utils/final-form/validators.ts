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

type tValidateResult = string | undefined;

export const composeValidators =
  <tValue>(...validators: ((value: tValue) => tValidateResult)[]) =>
  (value: tValue) =>
    validators.reduce(
      (error: string | undefined, validator) => error || validator(value),
      undefined,
    );
