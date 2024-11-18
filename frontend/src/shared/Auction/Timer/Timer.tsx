import React, { useEffect, useState } from 'react';
import styles from './timer.module.css';
import { ETextStyles } from '../../texts';
import { declension } from '../../../utils/declension';
import { secondsToHMS } from '../../../utils/secondsToHMS';

interface ITimer {
  initTime: number
}

export function Timer({initTime}: ITimer) {
  const timeValue: Array<number> = secondsToHMS(initTime);
  const [[hour, min, sec], setTime] = useState([timeValue[0], timeValue[1], timeValue[2]]);
  const [over, setOver] = useState(false);

  const tick = () => {
    if (hour === 0 && min === 0 && sec === 0) {
      setOver(true);
    } else if (min === 0 && sec === 0) {
      setTime([hour - 1, 59, 59]);
    } else if (sec == 0) {
      setTime([hour, min - 1, 59]);
    } else {
      setTime([hour, min, sec - 1]);
    }
  };

  useEffect(() => {
    if (!over) {
      const timerID = setInterval(() => tick(), 1000);
      return () => clearInterval(timerID);
    }
  });

  return (
    <div className={styles.container}>
      <div className={styles.block}>
        <p className={styles.value} style={ETextStyles.InSb14120}>{hour}</p>
        <p className={styles.text} style={ETextStyles.RwRg12120}>{declension(hour, 'час', 'часа', 'часов')}</p>
      </div>
      <div className={styles.dot}></div>
      <div className={styles.block}>
        <p className={styles.value} style={ETextStyles.InSb14120}>{min}</p>
        <p className={styles.text} style={ETextStyles.RwRg12120}>мин</p>
      </div>
      <div className={styles.dot}></div>
      <div className={styles.block}>
        <p className={styles.value} style={ETextStyles.InSb14120}>{sec.toString().length === 1 ? `0${sec}` : sec}</p>
        <p className={styles.text} style={ETextStyles.RwRg12120}>сек</p>
      </div>
    </div>
  );
}
