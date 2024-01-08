import { Link as RouterLink, LinkProps } from 'react-router-dom';
import cn from 'classnames';

import styles from './Link.module.css';

interface iProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    LinkProps {
  external?: boolean;
}

export function Link({ className, to, external = false, ...props }: iProps) {
  if (external) {
    return (
      <a
        href={to as string}
        className={cn(styles.link, className)}
        {...props}
      />
    );
  }

  return (
    <RouterLink to={to} className={cn(styles.link, className)} {...props} />
  );
}
