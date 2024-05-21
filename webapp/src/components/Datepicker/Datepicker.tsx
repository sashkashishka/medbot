import { useRef, useState } from 'react';
import { DatePicker } from 'react-date-picker';
import { useField, type UseFieldConfig } from 'react-final-form';
import cn from 'classnames';
import { useStore } from '@nanostores/react';

import { ValidationError } from '../ValidationError';
import { isError } from '../../utils/final-form';
import { isDateValid } from '../../utils/date';
import { lockScroll, unlockScroll } from '../../utils/lockScroll';
import { $t } from '../../stores/i18n';

import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import styles from './Datepicker.module.css';

interface iProps<tValue> extends React.InputHTMLAttributes<HTMLInputElement> {
  labelName: string;
  fieldName: string;
  fieldConfig?: UseFieldConfig<tValue>;
  testid?: string;
}

function format(value: string) {
  const date = new Date(value);

  return isDateValid(date) ? date : undefined;
}

export function Datepicker<tValue extends string>({
  labelName,
  fieldName,
  fieldConfig,
  testid,
}: iProps<tValue>) {
  const { input, meta } = useField<tValue, HTMLDivElement, Date>(fieldName, {
    validateFields: [],
    format,
    parse: (value: Date) => value?.toISOString?.() as tValue,
    ...fieldConfig,
  });
  const [isOpen, setIsOpen] = useState(false);
  const portalRef = useRef<HTMLDivElement>(null);
  const t = useStore($t);

  return (
    <label className={styles.row}>
      {labelName}
      <div onBlur={input.onBlur} onFocus={input.onFocus}>
        <DatePicker
          data-testid={testid}
          className={cn(
            styles.datepicker,
            isError(meta) && styles.datepickerError,
          )}
          dayPlaceholder={t.dayPlaceholder}
          monthPlaceholder={t.monthPlaceholder}
          yearPlaceholder={t.yearPlaceholder}
          format="dd/MM/y"
          locale="uk-UA"
          value={input.value}
          name={input.name}
          onChange={(date) => input.onChange(date)}
          portalContainer={portalRef.current}
          onCalendarOpen={() => {
            setIsOpen(true);
            lockScroll();
          }}
          onCalendarClose={() => {
            setIsOpen(false);
            unlockScroll();
          }}
        />
        <div
          id="datepicker-portal"
          ref={portalRef}
          className={cn(
            styles.calendarPortal,
            isOpen && styles.calendarPortalVisible,
          )}
        />
      </div>
      <ValidationError fieldMeta={meta} />
    </label>
  );
}
