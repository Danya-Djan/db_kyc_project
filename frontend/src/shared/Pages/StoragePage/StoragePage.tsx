import React, { useEffect, useState } from 'react';
import styles from './storagepage.module.css';
import { ETextStyles } from '../../texts';
import { StorageBtn } from '../../Storage/StorageBtn';
import { Button } from '../../Button';
import { EIcons, Icon } from '../../Icons';
import { сopyTextToClipboard } from '../../../utils/copyText';
import { Notification } from '../../Notification';
import { StoragePageBlock } from '../../Storage/StoragePageBlock';
import { FriendsPageBlock } from '../../Storage/FriendsPageBlock';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useNavigate } from 'react-router-dom';

export function StoragePage() {
  const userId = useAppSelector<string>(state => state.userTg.id);
  const [page, setPage] = useState('storage');
  const refLink = `https://t.me/sapphirecrown_bot?start=user_${userId}`;
  const [showNotif, setShow] = useState(false);
  const navigate = useNavigate();

  return (
    <div>
      <h1 style={ETextStyles.RwSb30100} className={styles.title}>Реферальная программа</h1>
      <div className={styles.btnGroup}>
        <StorageBtn active={page === 'storage'} type={'storage'} onClick={() => setPage('storage')}/>
        <StorageBtn isDev={true} active={page === 'friends'} type={'friends'} onClick={() => {
          navigate('/dev?type=friends')
          //setPage('friends')
        }
          } />
      </div>
      {page === 'storage' ? <StoragePageBlock/> : <FriendsPageBlock/>}
      <Button className={styles.btn} icon={<Icon icon={EIcons.CopyIcon} />} text='Пригласить друга' onClick={() => { сopyTextToClipboard(refLink); setShow(true)}}/>
      {showNotif && <Notification title='Успешно' text='Пригласительная ссылка скопирована' setShow={setShow} />}
    </div>
  );
}
