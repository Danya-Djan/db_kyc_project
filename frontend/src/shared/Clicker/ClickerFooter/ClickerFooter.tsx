import React, { useEffect, useState } from 'react';
import styles from './clickerfooter.module.css';
import { ClickerBtnFooter } from '../ClickerBtnFooter';
import { EIcons, Icon } from '../../Icons';
import { useNavigate } from 'react-router-dom';
import { isWhiteList } from '../../../utils/isWhiteList';

export function ClickerFooter() {
  const navigate = useNavigate();
  const [isDev, setIsDev] = useState(true);

  useEffect(() => {
    setIsDev(!isWhiteList());
  }, []);

  return (
    <div className={styles.container}>
      <ClickerBtnFooter text='Стили' className={styles.btn} onClick={() => navigate('/styles')}/>
      <ClickerBtnFooter text='Аукцион' className={styles.btn} onClick={() => { !isDev ? navigate('/auction') : navigate('/dev?type=auction') }}/>
      { !isDev && <div className={styles.fire}>
        <Icon icon={EIcons.FireIcon}/>
      </div>}
    </div>
  );
}
