import React, { useEffect, useState } from 'react';
import styles from './friendspageblock.module.css';
import { ETextStyles } from '../../texts';
import { RatingCard } from '../../Elements/RatingCard';
import { generateRandomString } from '../../../utils/generateRandom';
import { useFriendsData } from '../../hooks/useFriendsData';
import { ErrorPage } from '../../Pages/ErrorPage';
import { Spinner } from '../../Elements/Spinner';

export function FriendsPageBlock() {
  const { dataFriends, loadingFriends, errorFriends } = useFriendsData();
  const [ratingBlock, setRatingBlock] = useState(<div></div>);

  useEffect(() => {
    if (dataFriends.length != 0) {
      const block = dataFriends.map((user, index) => {
        return <RatingCard img={user.avatar ? user.avatar : ''} key={generateRandomString()} friend={true} index={index + 1} number={Number(user.rank)} name={user.username ? user.username : ''} score={user.points ? user.points : '0'} />;
      });
      
      //@ts-ignore
      setRatingBlock(block);
    }

  }, [dataFriends])
  

  return (
    <div>
      {loadingFriends && <div className={styles.spinnerContainer}><Spinner color='#FFFFFF' size='40px' thickness='6px' className={styles.spinner} /></div>}
      {!loadingFriends &&
      <div>
          {(!errorFriends) ?
            <div>
              {(dataFriends.length > 0) && <h2 style={ETextStyles.RwSb18120} className={styles.title}>Рейтинг друзей</h2>}
              <div className={styles.ranks}>{ratingBlock}</div>
            </div> :
            <ErrorPage fullScreen={false} title='Возникла ошибка загрузки списка друзей' text='Перезагрузите страницу или попробуйте позже' detail={errorFriends} />
          }
      </div>
      }
      <div className={`${styles.content} ${(dataFriends.length === 0) && styles.marginTop }`}>
        <p style={ETextStyles.RwSb18120} className={styles.title2}>Мало друзей?</p>
        <p style={ETextStyles.RwSb14120} className={styles.descr}>Используй все свои социальные сети! Больше друзей&nbsp;&mdash; больше доход в&nbsp;хранилище.</p>
      </div>
    </div>
  );
}
