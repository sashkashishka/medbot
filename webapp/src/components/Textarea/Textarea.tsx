import React from 'react';
import { type UseFieldConfig, useField } from 'react-final-form';
import cn from 'classnames';
import { ValidationError } from '../ValidationError';
import { isError } from '../../utils/final-form';

import styles from './Textarea.module.css';

interface iProps<tValue>
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  labelName: string;
  fieldName: string;
  fieldConfig?: UseFieldConfig<tValue>;
}

export function Textarea<tValue extends string>({
  labelName,
  fieldName,
  fieldConfig,
  className,
  ...props
}: iProps<tValue>): React.ReactElement {
  const { input, meta } = useField<tValue, HTMLTextAreaElement>(fieldName, {
    validateFields: [],
    ...fieldConfig,
  });

  return (
    <label className={styles.row}>
      {labelName}
      <textarea
        className={cn(
          styles.textarea,
          isError(meta) && styles.textareaError,
          className,
        )}
        {...props}
        {...input}
      />
      <ValidationError fieldMeta={meta} />
    </label>
  );
}
