import React from 'react';

import styles from './Emoji.module.css';

const EMOJI = {
  thinks: '🤔',
};

interface iProps {
  width: number;
  height: number;
  emoji: keyof typeof EMOJI;
}

export function Emoji({ width, height, emoji }: iProps) {
  return (
    <span
      className={styles.container}
      style={
        {
          '--e-width': `${width}px`,
          '--e-height': `${height}px`,
        } as React.CSSProperties
      }
    >
      {EMOJI[emoji]}
    </span>
  );
}
