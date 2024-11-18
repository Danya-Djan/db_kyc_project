import React from 'react';
import styles from './profile.module.css';
import { ETextStyles } from '../../texts';
import { formatNumber } from '../../../utils/formatNumber';
import { PersonIcon } from '../../Elements/PersonIcon';

interface IProfileClicker {
  name: string,
  points: number,
  img: string,
  className ?: string
}

export function Profile({ name, points, img, className }: IProfileClicker) {
  return (
    <div className={`${styles.container} ${className}`}>
      <PersonIcon img={img} size={30}/>
      <div className={styles.content}>
        <p style={ETextStyles.RwSb12120} className={styles.name}>{name}</p>
        <div className={styles.pointsContainer}>
          <p className={styles.points} style={ETextStyles.InSb10120}>
            {formatNumber(points)}
          </p>
          <div className={styles.icon} style={{ backgroundImage: "url('assets/btnIcon.png')"}}></div>
        </div>
      </div>
    </div>
  );
}
