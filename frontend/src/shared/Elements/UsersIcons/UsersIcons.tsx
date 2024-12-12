import React from 'react';
import styles from './usersicons.module.css';
import { PersonIcon } from '../PersonIcon';

interface IUsersIcons {
  size?: number,
  imgs?: Array<string>,
  className?: string,
}

export function UsersIcons({ size = 25, imgs = [], className = '' }: IUsersIcons) {
  return (
    <div className={`${styles.users} ${className}`} style={{height: `${size}px`, width: `${size*2.5}px`}}>
      <PersonIcon className={`${styles.userIcon} ${styles.userIcon1}`} size={size} img={imgs[0] ? imgs[0] : ''}/>
      <PersonIcon className={`${styles.userIcon} ${styles.userIcon2}`} size={size} left={size / 1.4} img={imgs[1] ? imgs[1] : ''} />
      <PersonIcon className={`${styles.userIcon} ${styles.userIcon3}`} size={size} left={2 * size / 1.4} img={imgs[2] ? imgs[2] : ''} />
    </div>
  );
}
