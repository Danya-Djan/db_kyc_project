import React from 'react';
import styles from './personicon.module.css';

interface IPersonIcon {
  size ?: number,
  img ?: string,
  className?: string,
  left?: number,
  letter?: string,
}

export function PersonIcon({ size = 25, img = '', className, left=0, letter }: IPersonIcon) {
  return (
    <div className={`${styles.container} ${className}`} style={{width: `${size}px`, height: `${size}px`, backgroundImage: `url(${img})`, left: `${left}px`}}>
      {img.length === 0 && <span className={styles.letter}>{letter?.toUpperCase()}</span> }
    </div>
  );
}
