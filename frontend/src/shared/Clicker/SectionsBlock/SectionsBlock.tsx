import React, { useEffect, useState } from 'react';
import styles from './sectionsblock.module.css';
import { CardSection } from '../../Elements/CardSection';
import { ETextStyles } from '../../texts';
import { PointsBlock } from '../../Elements/PointsBlock';
import { ModalWindow } from '../../ModalWindow';
import { ClickerPopup } from '../ClickerPopup';
import { useNavigate } from 'react-router-dom';
import { UsersIcons } from '../../Elements/UsersIcons';
import { formatNumber } from '../../../utils/formatNumber';
import { useAppSelector } from '../../hooks/useAppSelector';
import { IUserRank } from '../../../store/friends/actions';

interface ISectionsBlock {
  mult:number;
}

export function SectionsBlock({ mult }: ISectionsBlock) {
  const [close, setClose] = useState(true);
  const navigate = useNavigate();
  const referralStorage = Number(useAppSelector<string | undefined>(state => state.me.data.referralStorage));
  const maxReferralStorage = useAppSelector<number>(state => state.me.data.maxStorage);
  const [referralPercent, serReferralPercent] = useState(0);
  const [isDev, setIsDev] = useState(false);
  const userRank = useAppSelector<number | undefined>(state => state.me.data.rank);
  const rankData = useAppSelector<Array<IUserRank>>(state => state.rank.data);
  const [topImgs, setTopImgs] = useState<Array<string>>([]);

  useEffect(() => {
    const imgs:Array<string> = [];
    if(rankData.length != 0) {
      for (let i = 0; i < rankData.length; i++) {
        if (i < 3 && rankData[i].avatar) {
          //@ts-ignore
          imgs.push(rankData[i].avatar);
        }
      }
      setTopImgs(imgs);
    }
  }, [rankData]);

  useEffect(() => {
    if(referralStorage >= maxReferralStorage) {
      serReferralPercent(100);
    } else {
      serReferralPercent(referralStorage / maxReferralStorage * 100);
    }

  }, [referralStorage, maxReferralStorage]);

  const multipCards = [
    {
      title: 'Что он делает',
      text: <span>Увеличивает получение баллов с&nbsp;одного клика в&nbsp;столько раз, сколько указано в&nbsp;рамке.</span>,
      img: 'assets/Rocket.png'
    },
    {
      title: 'Как его увеличить',
      text: <span>Чем выше концентрация&nbsp;&mdash; клики в&nbsp;час, тем выше множитель, он&nbsp;рассчитывается по&nbsp;формуле.</span>,
      img: 'assets/Monocle.png'
    },
    {
      title: 'Может ли он уменьшиться',
      text: <span>Да, если снизится концентрация или долго не&nbsp;заходить в&nbsp;приложение и&nbsp;не&nbsp;совершать клики.</span>,
      img: 'assets/Chain.png'
    },
  ];

  //<UsersIcons imgs={topImgs} size={16}/>
  
  return (
    <div className={styles.sectionContainer}>
      <div className={styles.leftContainer}>
        <CardSection title='Место в топе' onClick={() => { !isDev ? navigate('/rating') : navigate('/dev?type=rating') }}>
          {<div className={`${styles.bottomRank} ${isDev ? styles.dev : ''}`}>
            <div style={ETextStyles.InSb12120}>
              <span className={styles.rank1}>#</span>
              <span>{isDev ? '?' : (userRank ? formatNumber(userRank) : '?')}</span>
            </div>
          </div>}
        </CardSection>
        <CardSection title='Множитель' onClick={() => { setClose(false) }}>
          <p style={ETextStyles.InSb12120}>
            <span style={{color: 'var(--primary)'}}>{'X '}</span>
            {mult}
          </p>
        </CardSection>
      </div>
      <CardSection title='Реферальное хранилище' className={styles.rigthEl} onClick={() => { navigate('/referral') }}>
        {<div>
          <PointsBlock points={formatNumber(referralStorage.toFixed(2))} className={styles.scalePoints} />
          <div className={styles.scaleContainer}>
            <div className={`${styles.scale}  ${referralPercent === 100 ? styles.scaleFull : ''}`} style={{ width: `${referralPercent}%` }}></div>
          </div>
          <p className={`${styles.scaleText} ${referralPercent === 100 ? styles.textFull : ''}`}>
            {referralPercent === 100 ? 'Хранилище заполнено, заберите коины' : 'Когда хранилище заполнится, вы сможете забрать баллы'}
          </p>
        </div>}
      </CardSection>
      {!close && <ModalWindow setCloseAnimOut={setClose} setClose={setClose} modalBlock={
        <ClickerPopup title='Что такое множитель' cards={multipCards} setClose={setClose}/>
      } />}
    </div>
  );
}
