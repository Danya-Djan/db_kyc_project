import React, { useEffect } from 'react';
import styles from './ratingpage.module.css';
import { RatingCard } from '../../Elements/RatingCard';
import { ETextStyles } from '../../texts';
import { generateRandomString } from '../../../utils/generateRandom';

export function RatingPage() {

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
      name: 'Ты',
      score: '50000'
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
    if(index > 3) {
      return <RatingCard number={index + 1} name={user.name} score={user.score} key={generateRandomString()} />;
    }
  })

  const firstBlock = rating.map((user, index) => {
    if(index < 3) {
      return <RatingCard number={index + 1} name={user.name} score={user.score} key={generateRandomString()}/>;
    }
  })


  return (
    <div className={styles.container}>
      <h1 className={styles.title} style={ETextStyles.RwSb30100}>Рейтинг игроков</h1>
      <div className={styles.winContainer}>{firstBlock}</div>
      <div className={styles.otherContainer}>{ratingBlock}</div>
    </div>
  );
}
