import React from 'react';
import styles from './spinner.module.css';

interface ISpinner {
  color: string,
  size: string,
  thickness: string,
  className ?: string
}

export function Spinner({ color, size, thickness, className='' }: ISpinner) {

  const spinnerStyles = {
    height: size,
    width: size,
    border: `${thickness} solid ${color}`,
    borderRightColor: 'transparent',
    borderRadius: '50%',
    display: 'inline-block'
  }

  return (
    <div style={spinnerStyles} className={`${styles.loadingAnimation} ${className}`}></div>
  );
}
