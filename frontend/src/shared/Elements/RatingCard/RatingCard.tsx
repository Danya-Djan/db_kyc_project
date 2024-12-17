import React from 'react';
import styles from './ratingcard.module.css';
import { EIcons, Icon } from '../../Icons';
import { PointsBlock } from '../PointsBlock';
import { ETextStyles } from '../../texts';
import { PersonIcon } from '../PersonIcon';

interface IRatingCard {
  number: number,
  name: string,
  score: string,
  index: number,
  friend ?: boolean,
  img: string
}

export function RatingCard({number, name, score, index, friend=false, img}: IRatingCard) {
  let order = number;
  if(friend) {
    order = index;
  }
  return (
    <div className={`${styles.container} ${(order < 4) && styles.win} ${name==='Ты' && styles.you}`}>
      <div className={styles.left}>
        {order === 1 && <div className={styles.medal}>
          <Icon icon={EIcons.MedalFirst}/>
        </div>}
        {order === 2 && <div className={styles.medal}>
          <Icon icon={EIcons.MedalSecond} />
        </div>}
        {order === 3 && <div className={styles.medal}>
          <Icon icon={EIcons.MedalThird} />
        </div>}
        {(order > 3 ) && <div className={styles.number} style={ETextStyles.InSb14120}>{order}</div>}
        <PersonIcon size={20} img={img} className={styles.img} letter={name[0]}/>
        <p style={ETextStyles.RwSb14120} className={styles.name}>{name}</p>
      </div>
      <PointsBlock points={score}/>
    </div>
  );
}
