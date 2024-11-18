import React from 'react';
import styles from './devpopup.module.css';
import { Button } from '../../Button';
import { ETextStyles } from '../../texts';

interface IDevPopup {
  setClose(a: boolean): void
  type: 'error' | 'dev'
}

export function DevPopup({ setClose, type }: IDevPopup) {
  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>
        <div className={styles.icon} style={{backgroundImage: "url('assets/dev.png')"}}></div>
      </div>
      <h2 className={styles.title} style={ETextStyles.RwSb24100}>{type === 'dev' ? 'Скоро будет доступно' : 'Возникла ошибка'}</h2>
      <p className={styles.text} style={ETextStyles.RwSb14120}>{type === 'dev' ? 'Пока что делаем эту фичу. Скоро сможете поюзать.' : 'Мы пока не можем принимать клики, но скоро всё починим.'}</p>
      <Button text={type === 'dev' ? 'Продолжить кликать' : 'Принято'} stroke={true} onClick={() => setClose(true)}/>
    </div>
  );
}