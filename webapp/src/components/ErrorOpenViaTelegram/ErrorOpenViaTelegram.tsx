import styles from './ErrorOpenViaTelegram.module.css';

interface iProps {
  testid: string;
}

// TODO write message in uk
export function ErrorOpenViaTelegram({ testid }: iProps) {
  return (
    <div className={styles.container} data-testid={testid}>
      Please open webapp via telegram bot
    </div>
  );
}
