import React from 'react';
import { UseFieldConfig, useField } from 'react-final-form';
import cn from 'classnames';
import { ValidationError } from '../ValidationError';

import styles from './Input.module.css';
import { isError } from '../../utils/final-form';

interface iProps<tValue> extends React.InputHTMLAttributes<HTMLInputElement> {
  labelName: string;
  fieldName: string;
  fieldConfig?: UseFieldConfig<tValue>;
}

export function Input<tValue extends string | number>({
  labelName,
  fieldName,
  fieldConfig,
  className,
  ...props
}: iProps<tValue>): React.ReactElement {
  const { input, meta } = useField<tValue, HTMLInputElement>(fieldName, {
    validateFields: [],
    ...fieldConfig,
  });

  return (
    <label className={styles.row}>
      {labelName}
      <input
        className={cn(
          styles.input,
          isError(meta) && styles.inputError,
          className,
        )}
        {...props}
        {...input}
      />
      <ValidationError fieldMeta={meta} />
    </label>
  );
}
