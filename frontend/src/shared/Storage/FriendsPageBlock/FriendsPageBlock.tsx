import React from 'react';
import styles from './friendspageblock.module.css';
import { ETextStyles } from '../../texts';
import { RatingCard } from '../../Elements/RatingCard';

interface IRating {
  name: string,
  score: string
}

export function FriendsPageBlock() {

  //const rating: Array<IRating> = [];
  
  const rating = [
    {
      name: 'Anficee',
      score: '1000000'
    },
    {
      name: 'Maria',
      score: '300000'
    },
    {
      name: 'Greg',
      score: '90000'
    },
    {
      name: 'Kate',
      score: '80000'
    },
    {
      name: 'Eva',
      score: '70000'
    },
    {
      name: 'Bill',
      score: '40000'
    },
    {
      name: 'Bradley',
      score: '30000'
    },
  ];

  const ratingBlock = rating.map((user, index) => {
    return <RatingCard number={index + 1} name={user.name} score={user.score} />;
  })

  return (
    <div>
      {(rating.length > 0) && <h2 style={ETextStyles.RwSb18120} className={styles.title}>Рейтинг друзей</h2>}
      <div className={styles.ranks}>{ratingBlock}</div>
      <div className={`${styles.content} ${(rating.length === 0) && styles.marginTop }`}>
        <p style={ETextStyles.RwSb18120} className={styles.title2}>Мало друзей?</p>
        <p style={ETextStyles.RwSb14120} className={styles.descr}>Используй все свои социальные сети! Больше друзей&nbsp;&mdash; больше доход в&nbsp;хранилище.</p>
      </div>
    </div>
  );
}
