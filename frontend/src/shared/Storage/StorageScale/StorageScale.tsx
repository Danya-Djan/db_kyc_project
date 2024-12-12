import React, { useEffect, useState } from 'react';
import styles from './storagescale.module.css';
import { PointsBlock } from '../../Elements/PointsBlock';
import { ETextStyles } from '../../texts';
import { Notification } from '../../Notification';
import { useDispatch } from 'react-redux';
import { emptyReferralStorage } from '../../../store/me/actions';
import { useAppSelector } from '../../hooks/useAppSelector';
import axios from 'axios';
import { ModalWindow } from '../../ModalWindow';
import { DevPopup } from '../../Elements/DevPopup';

interface IStorageScale {
  percent: number,
  points: string,
  className ?: string,
  isDev?: boolean,
}

export function StorageScale({ percent, points, className, isDev=false }: IStorageScale) {
  const [showNotif, setShow] = useState(false);
  const [savedPoints, setSavedPoints] = useState(points);
  const URL = useAppSelector<string>(state => state.url);
  const token = useAppSelector<string>(state => state.token);
  const [closeError, setCloseError] = useState(true);
  const [error, setError] = useState(false);
  const [animClose, setAnimClose] = useState(false);
  const dispatch = useDispatch();

  const click = () => {
    if(percent === 100) {
      setError(false);

      if(token) {
        axios.post(`${URL}/api/v1/users/empty-storage/`,
          {},
          {
            headers: {
              "Authorization": `TelegramToken ${token}`
            }
          }
        ).then(resp => {
          if (!error) {
            setShow(true);
            dispatch<any>(emptyReferralStorage());
            //console.log(resp);
          }
        }).catch(err => {
          setError(true);
          setCloseError(false);
          console.log(err);
        });
      }
    }
  };

  return (
    <div className={`${styles.container} ${percent === 100 && styles.full} ${className}`} onClick={() => click()}>
      <div className={styles.content} style={ETextStyles.InSb16120}>
        {percent === 100 && <p>Забрать</p>}
        {percent > 0 && <PointsBlock points={(Number(points).toFixed(2)).toString()} sizeIcon={20} sizeText={16} />}
        {percent === 0 && <div className={styles.imgVolt} style={{backgroundImage: "url('assets/Volt.png')"}}></div>}
        {percent === 0 && <p style={ETextStyles.InRg14120}>{!isDev ? 'Больше друзей — быстрее заполнение' : 'Успевай привести друзей без лимитов'}</p> }
      </div>
      <div className={styles.scale} style={{ width: `${percent}%`}}></div>
      {showNotif && <Notification title='Пополнение' text={`Баланс баллов увеличен на ${savedPoints}`} setShow={setShow} />}
      {!closeError && <ModalWindow removeBtn={true} setCloseAnimOut={setAnimClose} closeAnimOut={animClose} setClose={setCloseError} modalBlock={
        <DevPopup setClose={setAnimClose} title='Возникла ошибка' text='Не получилось забрать баллы из реферального хранилища, но скоро всё починим.' />
      } />}
    </div>
  );
}
