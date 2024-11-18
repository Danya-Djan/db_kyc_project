import React, { useState } from 'react';
import styles from './sectionsblock.module.css';
import { CardSection } from '../../Elements/CardSection';
import { ETextStyles } from '../../texts';
import { PointsBlock } from '../../Elements/PointsBlock';
import { ModalWindow } from '../../ModalWindow';
import { ClickerPopup } from '../ClickerPopup';
import { useNavigate } from 'react-router-dom';
import { UsersIcons } from '../../Elements/UsersIcons';
import { formatNumber } from '../../../utils/formatNumber';
import { DevPopup } from '../../Elements/DevPopup';

export function SectionsBlock() {
  const scaleRef = 70;
  const [close, setClose] = useState(true);
  const navigate = useNavigate();
  const [closeAnimOut, setCloseAnimOut] = useState(false);
  const [closeDev, setCloseDev] = useState(true);

  const isDev = false;

  const multipCards = [
    {
      title: 'Что он делает',
      text: <span>Увеличивает получение баллов с&nbsp;одного клика в&nbsp;столько раз, сколько указано в&nbsp;рамке внизу экрана.</span>,
      img: 'assets/Rocket.png'
    },
    {
      title: 'Как его увеличить',
      text: <span>Чем выше концентрация&nbsp;&mdash; клики в&nbsp;час, тем выше мультипликатор, он&nbsp;рассчитывается по&nbsp;формуле.</span>,
      img: 'assets/Monocle.png'
    },
    {
      title: 'Может ли он уменьшиться',
      text: <span>Да, если снизится концентрация или долго не&nbsp;заходить в&nbsp;приложение и&nbsp;не&nbsp;совершать клики.</span>,
      img: 'assets/Chain.png'
    },
  ];
  
  return (
    <div className={styles.sectionContainer}>
      <div className={styles.leftContainer}>
        <CardSection title='Место в топе' onClick={() => {!isDev ? navigate('/rating') : setCloseDev(false)}}>
          {!isDev && <div className={styles.bottomRank}>
            <div style={ETextStyles.InSb12120}>
              <span className={styles.rank1}>#</span>
              <span>{formatNumber(12980)}</span>
            </div>
            <UsersIcons size={16}/>
          </div>}
        </CardSection>
        <CardSection title='Множитель' onClick={() => { !isDev ? setClose(false) : setCloseDev(false) }}>
          {!isDev &&<PointsBlock points='1.50' />}
        </CardSection>
      </div>
      <CardSection title='Реферальное хранилище' className={styles.rigthEl} onClick={() => { !isDev ? navigate('/referral') : setCloseDev(false) }}>
        {!isDev &&<div>
          <PointsBlock points={formatNumber(800)} className={styles.scalePoints} />
          <div className={styles.scaleContainer}>
            <div className={styles.scale} style={{ width: `${scaleRef}px` }}></div>
          </div>
          <p className={styles.scaleText}>
            Хранилище заполнено, заберите коины
          </p>
        </div>}
      </CardSection>
      {!close && <ModalWindow setCloseAnimOut={setClose} setClose={setClose} modalBlock={
        <ClickerPopup title='Что такое множитель' cards={multipCards} setClose={setClose}/>
      } />}
      {!closeDev && <ModalWindow removeBtn={true} setCloseAnimOut={setCloseAnimOut} closeAnimOut={closeAnimOut} setClose={setCloseDev} modalBlock={
        <DevPopup setClose={setCloseAnimOut} type='dev' />
      } />}
    </div>
  );
}
