import React, { useEffect, useState } from 'react';
import styles from './storagepage.module.css';
import { ETextStyles } from '../../texts';
import { StorageBtn } from '../../Storage/StorageBtn';
import { StorageScale } from '../../Storage/StorageScale';
import { PopupCard } from '../../Elements/PopupCard';
import { Button } from '../../Button';
import { EIcons, Icon } from '../../Icons';
import { сopyTextToClipboard } from '../../../utils/copyText';
import { Notification } from '../../Notification';
import { StoragePageBlock } from '../../Storage/StoragePageBlock';
import { FriendsPageBlock } from '../../Storage/FriendsPageBlock';

export function StoragePage() {
  const [page, setPage] = useState('storage');
  const refLink = 'https://open.spotify.com/';
  const [showNotif, setShow] = useState(false);

  return (
    <div>
      <h1 style={ETextStyles.RwSb30100} className={styles.title}>Реферальная программа</h1>
      <div className={styles.btnGroup}>
        <StorageBtn active={page === 'storage'} type={'storage'} onClick={() => setPage('storage')}/>
        <StorageBtn active={page === 'friends'} type={'friends'} onClick={() => setPage('friends')} />
      </div>
      {page === 'storage' ? <StoragePageBlock/> : <FriendsPageBlock/>}
      <Button className={styles.btn} icon={<Icon icon={EIcons.CopyIcon} />} text='Пригласить друга' onClick={() => { сopyTextToClipboard(refLink); setShow(true)}}/>
      {showNotif && <Notification title='Успешно' text='Пригласительная ссылка скопирована' setShow={setShow} />}
    </div>
  );
}
