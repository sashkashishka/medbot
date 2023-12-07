import React from 'react';
import { UseFieldConfig, useField } from 'react-final-form';
import cn from 'classnames';
import { ValidationError } from '../ValidationError';

import styles from './Input.module.css';

interface iProps<tValue> extends React.InputHTMLAttributes<HTMLInputElement> {
  fieldName: string;
  fieldConfig?: UseFieldConfig<tValue>;
}

export function Input<tValue extends string | number>({
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
    <div>
      <input className={cn(styles.input, className)} {...props} {...input} />
      <ValidationError fieldMeta={meta} />
    </div>
  );
}
