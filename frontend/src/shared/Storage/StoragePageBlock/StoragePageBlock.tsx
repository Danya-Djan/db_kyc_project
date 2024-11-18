import React from 'react';
import styles from './storagepageblock.module.css';
import { StorageScale } from '../StorageScale';
import { ETextStyles } from '../../texts';
import { PopupCard } from '../../Elements/PopupCard';

export function StoragePageBlock() {
  return (
    <div>
      <h2 style={ETextStyles.RwSb18120} className={styles.title}>Хранилище</h2>
      <StorageScale points='400' percent={70} className={styles.scale} />
      <p style={ETextStyles.RwRg10120} className={styles.descr}>
        В&nbsp;хранилище приходит часть коинов, заработанная вашими друзьями. Считаем так: количество коинов * 5%. Хранилище пополняется каждый вечер.
      </p>
      <h2 style={ETextStyles.RwSb18120} className={styles.title}>Как пригласить друга?</h2>
      <div className={styles.cards}>
        <PopupCard img='assets/Chain.png' title='Отправляй ссылку другу' text={<span>Друг присоединяется по&nbsp;пригласительной ссылке и&nbsp;становится рефералом, как только совершает активность в&nbsp;приложении.</span>} />
        <PopupCard img='assets/Money.png' title='Зарабатывайте вместе' text={<span>Друг кликает, ты&nbsp;получаешь&nbsp;5% его кликов, а&nbsp;он&nbsp;3% с&nbsp;твоих. Не&nbsp;забывай забирать коины из&nbsp;хранилища!</span>} />
      </div>
    </div>
  );
}
