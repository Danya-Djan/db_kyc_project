import React, { useEffect, useState } from 'react';
import styles from './ratingpage.module.css';
import { RatingCard } from '../../Elements/RatingCard';
import { ETextStyles } from '../../texts';
import { generateRandomString } from '../../../utils/generateRandom';
import { useRankData } from '../../hooks/useRankData';
import { Spinner } from '../../Elements/Spinner';
import { ErrorPage } from '../ErrorPage';

export function RatingPage() {
  const { dataRank, loadingRank, errorRank } = useRankData();
  const [topBlock, setTopBlock] = useState(<div></div>);
  const [otherBlock, setOtherBlock] = useState(<div></div>);

  useEffect(() => {
    if (dataRank.length != 0) {
      const firstBlock = dataRank.map((user, index) => {
        if (index < 3) {
          return <RatingCard img={user.avatar ? user.avatar : ''} index={index + 1} number={Number(user.rank)} name={user.username ? user.username : ''} score={user.points ? user.points : '0'} key={generateRandomString()} />;
        }
      });
      //@ts-ignore
      setTopBlock(firstBlock);

      const ratingBlock = dataRank.map((user, index) => {
        if (index > 2) {
          return <RatingCard img={user.avatar ? user.avatar : ''} index={index + 1} number={Number(user.rank)} name={user.username ? user.username : ''} score={user.points ? user.points : '0'} key={generateRandomString()} />;
        }
      });
      //@ts-ignore
      setOtherBlock(ratingBlock);

    }
  }, [dataRank])



  return (
    <div className={styles.container}>
      {loadingRank && <div className={styles.spinnerContainer}><Spinner color='#FFFFFF' size='40px' thickness='6px' className={styles.spinner} /></div>}
      {!loadingRank && <div>
        {errorRank ? <ErrorPage fullScreen={true} title='Возникла ошибка загрузки рейтинга' text='Перезагрузите страницу или попробуйте позже' detail={errorRank} /> :
          <div>
            <h1 className={styles.title} style={ETextStyles.RwSb30100}>Рейтинг игроков</h1>
            <div className={styles.winContainer}>{topBlock}</div>
            <div className={styles.otherContainer}>{otherBlock}</div>
          </div>
        }
      </div> }
    </div>
  );
}
