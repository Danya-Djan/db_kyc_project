import React, { useEffect, useState } from 'react';
import styles from './storagepageblock.module.css';
import { StorageScale } from '../StorageScale';
import { ETextStyles } from '../../texts';
import { PopupCard } from '../../Elements/PopupCard';
import { useAppSelector } from '../../hooks/useAppSelector';

export function StoragePageBlock() {
  const referralStorage = Number(useAppSelector<string | undefined>(state => state.me.data.referralStorage));
  const maxReferralStorage = useAppSelector<number>(state => state.me.data.maxStorage);
  const [referralPercent, serReferralPercent] = useState(0);

  useEffect(() => {
    if (referralStorage > maxReferralStorage) {
      serReferralPercent(100);
    } else {
      serReferralPercent(referralStorage / maxReferralStorage * 100);
    }

  }, [referralStorage, maxReferralStorage]);

  return (
    <div>
      <h2 style={ETextStyles.RwSb18120} className={styles.title}>Хранилище</h2>
      <div className={`${styles.containerStorage}`}>
        <StorageScale points={referralStorage.toString()} percent={referralPercent} className={styles.scale}/>
        <p style={ETextStyles.RwRg10120} className={styles.descr}>
          В&nbsp;хранилище приходит часть коинов, заработанных вашими друзьями. Считаем так: количество коинов * 5%. Хранилище пополняется каждый вечер.
        </p>
      </div>
      <h2 style={ETextStyles.RwSb18120} className={styles.title}>Как пригласить друга?</h2>
      <div className={styles.cards}>
        <PopupCard img='assets/Chain.png' title='Отправляй ссылку другу' text={<span>Друг присоединяется по&nbsp;пригласительной ссылке и&nbsp;становится рефералом, как только совершает активность в&nbsp;приложении.</span>} />
        <PopupCard img='assets/Money.png' title='Зарабатывайте вместе' text={<span>Друг кликает, ты&nbsp;получаешь&nbsp;5% его кликов, а&nbsp;он&nbsp;&mdash; 3%&nbsp;с&nbsp;твоих. Не&nbsp;забывай забирать коины из&nbsp;хранилища!</span>} />
      </div>
    </div>
  );
}
