import React from 'react';
import styles from './clickerbtnfooter.module.css';
import { ETextStyles } from '../../texts';
import { EIcons, Icon } from '../../Icons';

interface IClickerBtnFooter {
  text: string,
  className ?: string,
  onClick(): void
}
 
export function ClickerBtnFooter({ text, className, onClick }: IClickerBtnFooter) {
  return (
    <div className={`${styles.container} ${className}`} onClick={onClick}>
      <div className={styles.content}>
        <div className={styles.icon}><Icon icon={EIcons.BitCoinIcon} /></div>
        <p style={ETextStyles.RwSb14120} className={styles.text}>{text}</p>
      </div>
    </div>
  );
}
