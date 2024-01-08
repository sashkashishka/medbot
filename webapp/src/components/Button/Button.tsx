import React from 'react';
import cn from 'classnames';
import styles from './Button.module.css';

interface iProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({ className, ...props }: iProps) {
  return <button className={cn(styles.button, className)} {...props} />;
}
