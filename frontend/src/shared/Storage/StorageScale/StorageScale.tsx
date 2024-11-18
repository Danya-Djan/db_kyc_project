import React, { useState } from 'react';
import styles from './storagescale.module.css';
import { PointsBlock } from '../../Elements/PointsBlock';
import { ETextStyles } from '../../texts';
import { Notification } from '../../Notification';

interface IStorageScale {
  percent: number,
  points: string,
  className ?: string,
}

export function StorageScale({ percent, points, className }: IStorageScale) {
  const [showNotif, setShow] = useState(false);
  const [initpercent, setPercent] = useState(percent);

  const click = () => {
    if(percent === 100) {
      setShow(true);
      setPercent(0);
    }
  };

  return (
    <div className={`${styles.container} ${initpercent === 100 && styles.full} ${className}`} onClick={() => click()}>
      <div className={styles.content} style={ETextStyles.InSb16120}>
        {initpercent ===100 && <p>Забрать</p>}
        {initpercent > 0 && <PointsBlock points={points} sizeIcon={20} sizeText={16} />}
        {initpercent === 0 && <div className={styles.imgVolt} style={{backgroundImage: "url('assets/Volt.png')"}}></div>}
        {initpercent === 0 && <p style={ETextStyles.InRg14120}>Больше друзей — быстрее заполнение</p> }
      </div>
      <div className={styles.scale} style={{ width: `${initpercent}%`}}></div>
      {showNotif && <Notification title='Пополнение' text={`Баланс баллов увеличен на ${points}`} setShow={setShow} />}
    </div>
  );
}
