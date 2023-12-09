import type { Decorator } from 'final-form';
import { debounce } from '../../../utils/debounce';

interface iOptions<tFormValues> {
  lsKey: string;
  populateValues?: Partial<tFormValues>;
}

export function createPersistDecorator<tFormValues = Record<string, any>>({
  lsKey,
  populateValues,
}: iOptions<tFormValues>): Decorator<tFormValues> {
  return function persistDecorator(form) {
    const { initialValues } = form.getState();

    const persistedValues = localStorage.getItem(lsKey) || '{}';

    form.initialize({
      ...initialValues,
      ...JSON.parse(persistedValues),
      ...populateValues,
    });

    const unsubscribe = form.subscribe(
      debounce(({ values, pristine }) => {
        if (!pristine) {
          localStorage.setItem(lsKey, JSON.stringify(values));
        }
      }, 500),
      { values: true, pristine: true },
    );

    return unsubscribe;
  };
}
