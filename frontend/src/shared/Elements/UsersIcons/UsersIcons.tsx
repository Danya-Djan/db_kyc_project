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
      <PersonIcon className={`${styles.userIcon} ${styles.userIcon1}`} size={size}/>
      <PersonIcon className={`${styles.userIcon} ${styles.userIcon2}`} size={size} left={size/1.4}/>
      <PersonIcon className={`${styles.userIcon} ${styles.userIcon3}`} size={size} left={2*size / 1.4} />
    </div>
  );
}
