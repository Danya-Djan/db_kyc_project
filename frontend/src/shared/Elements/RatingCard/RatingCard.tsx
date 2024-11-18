import React from 'react';
import styles from './ratingcard.module.css';
import { EIcons, Icon } from '../../Icons';
import { PointsBlock } from '../PointsBlock';
import { ETextStyles } from '../../texts';

interface IRatingCard {
  number: number,
  name: string,
  score: string
}

export function RatingCard({number, name, score}: IRatingCard) {
  return (
    <div className={`${styles.container} ${number < 4 && styles.win} ${name==='Ты' && styles.you}`}>
      <div className={styles.left}>
        {(number === 1) && <div className={styles.medal}>
          <Icon icon={EIcons.MedalFirst}/>
        </div>}
        {(number === 2) && <div className={styles.medal}>
          <Icon icon={EIcons.MedalSecond} />
        </div>}
        {(number === 3) && <div className={styles.medal}>
          <Icon icon={EIcons.MedalThird} />
        </div>}
        {(number > 3) && <div className={styles.number} style={ETextStyles.InSb14120}>{number}</div>}
        <div className={styles.img}></div>
        <p style={ETextStyles.RwSb14120} className={styles.name}>{name}</p>
      </div>
      <PointsBlock points={score}/>
    </div>
  );
}
