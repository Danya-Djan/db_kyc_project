import React from 'react';
import styles from './usersicons.module.css';
import { PersonIcon } from '../PersonIcon';
import { EIcons, Icon } from '../../Icons';

interface IUsersIcons {
  size?: number,
  imgs?: Array<string>,
  className?: string,
}

export function UsersIcons({ size = 25, imgs = [], className = '' }: IUsersIcons) {
  return (
    <div className={`${styles.users} ${className}`} style={{height: `${size}px`, width: `${size*2.5}px`}}>
      <div className={`${styles.userIcon} ${styles.userIcon1}`}>
        <Icon icon={EIcons.MedalFirst}/>
      </div>
      <div className={`${styles.userIcon} ${styles.userIcon2}`}>
        <Icon icon={EIcons.MedalSecond} />
      </div>
      <div className={`${styles.userIcon} ${styles.userIcon3}`}>
        <Icon icon={EIcons.MedalThird} />
      </div>
    </div>
  );
}
