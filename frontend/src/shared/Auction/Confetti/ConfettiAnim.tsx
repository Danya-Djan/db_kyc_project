import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './confetti.module.css';
import { useWindowSize } from 'usehooks-ts'
import Confetti from 'react-confetti';

interface IConfettiAnim {
  opacity: number,
  setOpacity(a: number): void
}

export function ConfettiAnim({ opacity, setOpacity }: IConfettiAnim) {
  const node = document.querySelector('#modal_root');
  const { width, height } = useWindowSize();

  if (!node) return null;

  useEffect(() => {
    if(opacity === 1) {
      const timer = setInterval(() => {
        setOpacity(0);
        clearInterval(timer);
      }, 5000);
    }
  }, [opacity]);
  
  return (
    ReactDOM.createPortal((
      <Confetti
        width={width}
        height={height}
        className={`${styles.confetti} ${opacity === 1 && styles.animation}`}
        opacity={opacity}
      />
    ), node)
  );
}
