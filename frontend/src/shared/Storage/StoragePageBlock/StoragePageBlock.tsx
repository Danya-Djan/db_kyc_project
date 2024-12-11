import React, { useState } from 'react';
import styles from './storagepageblock.module.css';
import { StorageScale } from '../StorageScale';
import { ETextStyles } from '../../texts';
import { PopupCard } from '../../Elements/PopupCard';
import { ModalWindow } from '../../ModalWindow';
import { DevPopup } from '../../Elements/DevPopup';

export function StoragePageBlock() {
  const [closeAnimOut, setCloseAnimOut] = useState(false);
  const [closeDev, setCloseDev] = useState(true);
  const isDev = true;
  return (
    <div>
      <h2 style={ETextStyles.RwSb18120} className={styles.title}>Хранилище</h2>
      <div className={`${styles.containerStorage}`} onClick={() => setCloseDev(false)}>
        <StorageScale points='0' percent={0} className={styles.scale} isDev={true}/>
        {!isDev && <p style={ETextStyles.RwRg10120} className={styles.descr}>
          В&nbsp;хранилище приходит часть коинов, заработанная вашими друзьями. Считаем так: количество коинов * 5%. Хранилище пополняется каждый вечер.
        </p>}
        {isDev && <div style={{height: '30px'}}></div> }
      </div>
      <h2 style={ETextStyles.RwSb18120} className={styles.title}>Как пригласить друга?</h2>
      <div className={styles.cards}>
        <PopupCard img='assets/Chain.png' title='Отправляй ссылку другу' text={<span>Друг присоединяется по&nbsp;пригласительной ссылке и&nbsp;становится рефералом, как только совершает активность в&nbsp;приложении.</span>} />
        <PopupCard img='assets/Money.png' title='Зарабатывайте вместе' text={<span>Друг кликает, ты&nbsp;получаешь&nbsp;5% его кликов, а&nbsp;он&nbsp;3% с&nbsp;твоих. Не&nbsp;забывай забирать коины из&nbsp;хранилища!</span>} />
      </div>
      {!closeDev && <ModalWindow removeBtn={true} setCloseAnimOut={setCloseAnimOut} closeAnimOut={closeAnimOut} setClose={setCloseDev} modalBlock={
        <DevPopup setClose={setCloseAnimOut} type='dev' />
      } />}
    </div>
  );
}
