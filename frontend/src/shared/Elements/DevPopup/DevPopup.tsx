import React from 'react';
import styles from './devpopup.module.css';
import { Button } from '../../Button';
import { ETextStyles } from '../../texts';

interface IDevPopup {
  setClose(a: boolean): void
  title: string,
  text: string,
}

export function DevPopup({ setClose, title, text }: IDevPopup) {
  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>
        <div className={styles.icon} style={{backgroundImage: "url('assets/programming.gif')"}}></div>
      </div>
      <h2 className={styles.title} style={ETextStyles.RwSb24100}>{title}</h2>
      <p className={styles.text} style={ETextStyles.RwSb14120}>{text}</p>
      <Button text='Принято' onClick={() => setClose(true)}/>
    </div>
  );
}
