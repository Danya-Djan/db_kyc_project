import React from 'react';
import styles from './storagebtn.module.css';
import { ETextStyles } from '../../texts';
import { EIcons, Icon } from '../../Icons';

interface IStorageBtn {
  type: 'storage' | 'friends',
  active: boolean,
  onClick(): void
}

export function StorageBtn({ type, active, onClick }: IStorageBtn) {
  const selectedStyle = Number(localStorage.getItem('selectedStyle'));

  return (
    <button className={`${styles.container} ${active ? styles.fill : styles.stroke}`} style={ETextStyles.RwSb12120} onClick={onClick}>
      <div className={styles.content}>
        {type === 'storage' ? <Icon icon={EIcons.TrendIcon} /> : <Icon icon={EIcons.ChartIcon} />}
        <p className={selectedStyle === 2 ? styles.darkText : ''}>{type === 'storage' ? 'Хранилище' : 'Друзья'}</p>
      </div>
    </button>
  );
}
