import React from 'react';
import styles from './popupcard.module.css';
import { ETextStyles } from '../../texts';

interface IPopupCard {
  title: string,
  text: string | React.ReactNode,
  img: string
}

export function PopupCard({ title, text, img }: IPopupCard) {
  return (
    <div className={styles.container}>
      <div className={styles.img} style={{ backgroundImage: `url(${img})`}}></div>
      <div className={styles.content}>
        <h3 className={styles.title} style={ETextStyles.InSb14120}>{title}</h3>
        <p style={ETextStyles.InSb10120} className={styles.text}>{text}</p>
      </div>
    </div>
  );
}
