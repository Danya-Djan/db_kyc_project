import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './notification.module.css';
import { ETextStyles } from '../texts';

interface INotification {
  title: string,
  text: string,
  setShow(a: boolean): void
}

export function Notification({ title, text, setShow }: INotification) {
  const [closeAnim, setCloseAnim] = useState(false);
  const node = document.querySelector('#modal_root');
  if (!node) return null;

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setCloseAnim(true);
      clearTimeout(timer1);
      const timer2 = setTimeout(() => {
        setShow(false);
        clearTimeout(timer2);
      }, 400);
    }, 5000);
  }, []);

  return ReactDOM.createPortal((
    <div className={`${styles.container} ${styles.animationOpen} ${closeAnim && styles.animationClose}`}>
      <div className={styles.back}></div>
      <div className={styles.content}>
        <p className={styles.title} style={ETextStyles.RwSb14120}>{title}</p>
        <p className={styles.text} style={ETextStyles.RwRg12120}>{text}</p>
      </div>
    </div>
  ), node);
}
