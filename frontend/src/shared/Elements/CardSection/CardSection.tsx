import React from 'react';
import styles from './cardsection.module.css';
import { ETextStyles } from '../../texts';
import { EIcons, Icon } from '../../Icons';

interface ICardSection {
  title: string,
  children ?: React.ReactNode,
  className ?: string,
  onClick?: () => void,
}

export function CardSection({ title, children, className, onClick }: ICardSection) {
  return (
    <div className={`${styles.container} ${className}`} onClick={onClick}>
      <div className={styles.arrow}>
        <Icon icon={EIcons.ArrowIcon}/>
      </div>
      <p style={ETextStyles.RwSb12120} className={styles.title}>{title}</p>
      {children}
    </div>
  );
}
