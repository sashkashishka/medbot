import styles from './Loader.module.css';

interface iProps {
  fullscreen?: boolean;
}

function LoaderIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="128"
      height="128"
      version="1.0"
      viewBox="0 0 128 128"
      fill="currentColor"
      className={styles.loaderIcon}
    >
      <path d="M5.1 1.4C0 4.2.1 3.5 0 63.7c0 41.5.3 56.9 1.2 58.8 2.3 5.2 4.3 5.5 34.8 5.5 30.5 0 32.5-.3 34.8-5.5 1.7-3.7 1.7-113.3 0-117C68.4.3 66.5 0 35.8 0 14.2.1 6.9.4 5.1 1.4zM66 6c1.9 1.9 2 3.3 2 44.1v42.1l-3.3-4.4c-4-5.2-12.1-11.5-16-12.4l-2.9-.6 3.1-3.2c5.3-5.5 6.1-8.9 6.1-26.2V29.8l-3.4-3.4-3.4-3.4H23.8l-3.4 3.4-3.4 3.4v15.8C17 63 18 67 23.4 71.9l2.6 2.4-4.1 1.9c-5.5 2.4-11.5 7.3-15 12.1l-2.9 4V50.2C4 9.3 4.1 7.9 6 6c1.9-1.9 3.3-2 30-2s28.1.1 30 2zM49 29c1.6 1.6 2 3.3 2 8v6H21v-6c0-9.2 1.3-10 15-10 9.7 0 11.2.2 13 2zm1.9 25.9c-.4 8.5-1.8 11.4-7.3 15.5-3.8 2.9-11.4 2.9-15.2 0-5.5-4.1-6.9-7-7.3-15.5l-.3-7.9h30.4l-.3 7.9zM43.2 78c2.9.8 3.9 1.7 4.6 4.3 2.1 6.7 2 7.5-.4 9.8-6.6 6.2 1.3 16.5 8.4 11.2 3.9-2.9 4.2-8.4.7-11.2-2.3-1.8-5.1-8.8-4-9.9.8-.9 6.9 4.6 9.6 8.7 4.1 6.2 5.9 13.1 5.9 22.2 0 11.4 1.5 10.9-32.2 10.9-34 0-32.3.8-31.6-13.4.3-6.4 1.1-10.5 2.5-13.8 2.4-5.4 9.4-13.3 13.6-15.5l2.9-1.5-.7 3.4c-.4 1.8-1.2 3.5-1.9 3.7-.6.2-2.3 1.7-3.9 3.2-2.7 2.7-2.8 3.1-2.5 11.6.3 7.6.5 8.8 2.2 9.1 2.5.5 4.4-1.4 2.8-3-1.8-1.8-1.5-13.3.4-15.2 2-2 4.8-2 6.8 0 1.9 1.9 2.2 13.4.4 15.2-1.6 1.6.3 3.5 2.8 3 1.7-.3 1.9-1.5 2.2-9.1.3-8.7.2-8.8-2.8-11.9-3.1-3-3.1-3.3-2-7.4.7-2.4 2-4.5 2.9-4.7 3.1-.9 9.6-.7 13.3.3zm10.6 16.9c.8.4 1.2 1.9 1 3.2-.2 1.8-.9 2.4-2.8 2.4s-2.6-.6-2.8-2.4c-.3-2 1.1-4.1 2.8-4.1.3 0 1.1.4 1.8.9z" />
      <path d="M28.5 9c-1.4 2.2 1.2 3.1 8.1 2.8 5.3-.2 6.9-.6 6.9-1.8 0-1.2-1.6-1.6-7.2-1.8-4.5-.2-7.4.1-7.8.8zM33.1 32.5 30.8 35l2.6 2.7 2.6 2.6 2.6-2.6 2.6-2.7-2.3-2.5C37.6 31.2 36.3 30 36 30c-.3 0-1.6 1.2-2.9 2.5zM78 20c-1.9 1.9-2 3.3-2 20s.1 18.1 2 20c1.9 1.9 3.3 2 25.4 2 15.8 0 23.7-.4 24.2-1.1.3-.6-1.2-2.9-3.5-5.1-5.2-5.2-6.1-8.6-6.1-22.6 0-15.8.8-15.2-21-15.2-15.7 0-17.2.2-19 2zm36.1 15.5c.5 13.4.9 15.1 4.1 19.8l2 2.7-19.9-.2-19.8-.3-.3-16.5c-.1-9 0-17 .3-17.7.3-1.1 4-1.3 16.7-1.1l16.3.3.6 13z" />
      <path d="M92.7 27.2c-2.6 2-3.9 6.4-2.2 7.8 1.1.9 1.7.5 3-1.9 1.7-3.5 4.9-4.1 6.4-1.3.7 1.4.2 2.8-2 6.2-3 4.4-3.5 8-1.2 8.7.7.3 1.9-1.1 2.8-2.9.9-1.8 2.5-4.8 3.5-6.7 2.1-3.7 1.4-7.3-1.8-9.7-2.2-1.7-6.3-1.8-8.5-.2zM95.2 51.7c.2 1 1 1.8 1.8 1.8s1.6-.8 1.8-1.8c.2-1.2-.3-1.7-1.8-1.7s-2 .5-1.8 1.7zM88 72c-1.6 1.6-2 3.3-2 9.2 0 9.9-1.3 13.8-6.1 18.6-2.3 2.2-3.8 4.5-3.5 5.1.5.7 8.4 1.1 24.2 1.1 29.6 0 27.4 1.4 27.4-18 0-19 1.2-18-21-18-15.7 0-17.2.2-19 2zm35.5 16v13.5l-19.8.3-19.9.2 2-2.7c3-4.4 4.2-9.1 4.2-16.8 0-3.9.3-7.5.7-7.9.4-.3 7.9-.5 16.7-.4l16.1.3V88z" />
      <path d="M97.4 87.1c-1 1.7 1.3 3.6 2.7 2.2 1.2-1.2.4-3.3-1.1-3.3-.5 0-1.2.5-1.6 1.1zM105.4 87.1c-1 1.7 1.3 3.6 2.7 2.2 1.2-1.2.4-3.3-1.1-3.3-.5 0-1.2.5-1.6 1.1zM113.4 87.1c-1 1.7 1.3 3.6 2.7 2.2 1.2-1.2.4-3.3-1.1-3.3-.5 0-1.2.5-1.6 1.1z" />
    </svg>
  );
}

export function Loader({ fullscreen = true }: iProps) {
  if (fullscreen) {
    return (
      <div className={styles.container}>
        <LoaderIcon />
      </div>
    );
  }
  return <LoaderIcon />;
}