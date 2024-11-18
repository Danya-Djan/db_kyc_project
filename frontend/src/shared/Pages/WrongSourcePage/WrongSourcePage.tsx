import React from 'react';
import styles from './wrongsourcepage.module.css';
import { ETextStyles } from '../../texts';
import { Button } from '../../Button';
import { useWindowSize } from 'usehooks-ts';

export function WrongSourcePage() {
  const { width, height } = useWindowSize();

  return (
    <div className={styles.container} style={{height: `${height}px`}}>
      <h1 style={ETextStyles.RwSb24100} className={styles.title}>Похоже вы вошли не по той ссылке...</h1>
      <Button text='Войти через Telegram'/>
    </div>
  );
}