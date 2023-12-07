import React from 'react';
import type { FieldMetaState } from 'react-final-form';
import cn from 'classnames';

import styles from './ValidationError.module.css';

interface iProps<tValue> extends React.HTMLAttributes<HTMLSpanElement> {
  fieldMeta: FieldMetaState<tValue>;
}

export function ValidationError<tValue>({
  fieldMeta,
  className,
}: iProps<tValue>): React.ReactElement {
  if (fieldMeta.touched && fieldMeta.error) {
    return (
      <span className={cn(styles.validationError, className)}>
        {fieldMeta.error}
      </span>
    );
  }

  return <></>;
}
