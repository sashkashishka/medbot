import type { FormApi } from 'final-form';
import { debounce } from '../../../utils/debounce';

const PERSIST_KEY = 'order-form';

export function persistDecorator<tFormValues = Record<string, any>>(
  form: FormApi<tFormValues>,
) {
  const persistedValues = localStorage.getItem(PERSIST_KEY) || '{}';
  const { initialValues } = form.getState();

  // TODO init with user store
  form.initialize({ ...initialValues, ...JSON.parse(persistedValues) });

  const unsubscribe = form.subscribe(
    debounce(({ values, pristine }) => {
      if (!pristine) {
        localStorage.setItem(PERSIST_KEY, JSON.stringify(values));
      }
    }, 500),
    { values: true, pristine: true },
  );

  return unsubscribe;
}
