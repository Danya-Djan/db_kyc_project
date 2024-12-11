import React, { useState } from 'react';
import styles from './clickerfooter.module.css';
import { ClickerBtnFooter } from '../ClickerBtnFooter';
import { EIcons, Icon } from '../../Icons';
import { useNavigate } from 'react-router-dom';
import { ModalWindow } from '../../ModalWindow';
import { DevPopup } from '../../Elements/DevPopup';

export function ClickerFooter() {
  const navigate = useNavigate();
  const [closeAnimOut, setCloseAnimOut] = useState(false);
  const [closeDev, setCloseDev] = useState(true);
  const isDev = true;

  return (
    <div className={styles.container}>
      <ClickerBtnFooter text='Стили' className={styles.btn} onClick={() => navigate('/styles')}/>
      <ClickerBtnFooter text='Аукцион' className={styles.btn} onClick={() => { !isDev ? navigate('/auction') : setCloseDev(false) }}/>
      { !isDev && <div className={styles.fire}>
        <Icon icon={EIcons.FireIcon}/>
      </div>}
      {!closeDev && <ModalWindow removeBtn={true} setCloseAnimOut={setCloseAnimOut} closeAnimOut={closeAnimOut} setClose={setCloseDev} modalBlock={
        <DevPopup setClose={setCloseAnimOut} type='dev' />
      } />}
    </div>
  );
}
