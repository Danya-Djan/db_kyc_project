import React from 'react';
import styles from './productcard.module.css';
import { PersonIcon } from '../../Elements/PersonIcon';
import { PointsBlock } from '../../Elements/PointsBlock';
import { ETextStyles } from '../../texts';

interface IProductCard {
  name: string,
  img: string,
  bet: string,
  personImg ?: boolean | string,
  className ?: string
}

export function ProductCard({ name, img, bet, personImg=false, className }: IProductCard) {
  return (
    <div className={`${styles.card} ${className}`} >
      <div className={styles.left} style={{ width: `calc(100% - ${55 + bet.length * 9.5}px)` }}>
        <PersonIcon img={img} className={styles.productImg} />
        <p style={{ ...ETextStyles.InSb14120 }} className={styles.productName}>{name}</p>
      </div>
      <div className={styles.right}>
        <PointsBlock points={bet} left={true} className={styles.points} />
        {personImg && typeof personImg === 'string' && <PersonIcon img={personImg} />}
      </div>
    </div>
  );
}
