import React from 'react';
import styles from './errorpage.module.css';
import { Button } from '../../Button';
import { ETextStyles } from '../../texts';

interface IErrorPage {
  detail: String,
  title?: string,
  text?: string,
  fullScreen ?: boolean
}

export function ErrorPage({ detail, title, text, fullScreen=true }: IErrorPage) {
  return (
    <div className={`${styles.container} ${fullScreen ? styles.fullscreen : styles.margin}`}>
      <h1 className={styles.title} style={ETextStyles.RwSb24100}>{title ? title : 'Возникла ошибка при загрузке ваших данных'}</h1>
      <p className={styles.text} style={ETextStyles.RwSb14120}>{text ? text : 'Попробуйте перезагрузить страницу или войдите позже.'}</p>
      <Button text='Перезагрузить' stroke={true} onClick={() => window.location.reload()}/>
      {detail.length > 0 && <p className={styles.detail} style={ETextStyles.RwRg12120}>{detail}</p>}
    </div>
  );
}
