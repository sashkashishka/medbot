import type { Decorator } from 'final-form';
import { debounce } from '../../../utils/debounce';
import { mergeRightDeep } from '../../merge';

interface iOptions<tFormValues> {
  lsKey: string;
  populateValues?: Partial<tFormValues>;
  exclude?: (keyof tFormValues)[];
}

export function createPersistDecorator<tFormValues = Record<string, any>>({
  lsKey,
  populateValues,
  exclude = [],
}: iOptions<tFormValues>): Decorator<tFormValues> {
  return function persistDecorator(form) {
    const { initialValues } = form.getState();

    const persistedValues = localStorage.getItem(lsKey) || '{}';

    const values = mergeRightDeep(
      {
        ...initialValues,
        ...JSON.parse(persistedValues),
      },
      populateValues!,
    ) as tFormValues;

    form.initialize(values);

    const unsubscribe = form.subscribe(
      debounce(({ values, pristine }) => {
        if (pristine) return;

        const valuesToPersist = { ...values };

        Object.keys(valuesToPersist).forEach((key) => {
          if (exclude.includes(key as keyof tFormValues)) {
            delete valuesToPersist[key];
          }
        });

        localStorage.setItem(lsKey, JSON.stringify(valuesToPersist));
      }, 500),
      { values: true, pristine: true },
    );

    return unsubscribe;
  };
}
