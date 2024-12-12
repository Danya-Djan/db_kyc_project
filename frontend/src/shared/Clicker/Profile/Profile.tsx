import React from 'react';
import styles from './profile.module.css';
import { ETextStyles } from '../../texts';
import { formatNumber } from '../../../utils/formatNumber';
import { PersonIcon } from '../../Elements/PersonIcon';
import { EIcons, Icon } from '../../Icons';
import { useAppSelector } from '../../hooks/useAppSelector';
import { Spinner } from '../../Elements/Spinner';

interface IProfileClicker {
  name: string,
  img: string,
  className ?: string
}

export function Profile({ name, img, className }: IProfileClicker) {
  const points = useAppSelector<string | undefined>(state => state.me.data.points);
  const loading = useAppSelector<boolean>(state => state.me.loading);

  return (
    <div className={`${styles.container} ${className}`}>
      {img ? <PersonIcon img={`${img}`} size={30} /> : <Icon icon={EIcons.ProfileIcon} /> }
      <div className={styles.content}>
        <p style={ETextStyles.RwSb12120} className={styles.name}>{name}</p>
        <div className={styles.pointsContainer}>
          {points && <p className={styles.points} style={ETextStyles.InSb10120}>
            {formatNumber(Number(Number(points).toFixed(2)))}
          </p>}
          {!loading && <div className={styles.icon} style={{ backgroundImage: "url('assets/btnIcon.png')"}}></div>}
          {loading && <Spinner size='14px' color='#FFFFFF' thickness='2px' />}
        </div>
      </div>
    </div>
  );
}
