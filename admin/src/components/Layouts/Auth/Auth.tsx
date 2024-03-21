import styles from './Auth.module.css';

interface iProps {
  children: React.ReactNode | React.ReactNode[];
}

export function AuthLayout({ children }: iProps) {
  return <div className={styles.container}>{children}</div>;
}
