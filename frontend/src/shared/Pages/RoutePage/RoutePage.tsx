import React, { useEffect, useState } from 'react';
import styles from './routepage.module.css';
import { WrongSourcePage } from '../WrongSourcePage';
import { ClickerPage } from '../ClickerPage';
import { RatingPage } from '../RatingPage';
import { AuctionPage } from '../AuctionPage';
import { StoragePage } from '../StoragePage';
import { useTgData } from '../../hooks/useTgData';
import { StylesPage } from '../StylesPage';
import { updateStyles } from '../../../utils/updateStyles';
import { useUserData } from '../../hooks/useUserData';
import { Spinner } from '../../Elements/Spinner';
import { updateBackground } from '../../../utils/updateBackground';
import { ErrorPage } from '../ErrorPage';
import { useNavigate } from 'react-router-dom';
import { DevPage } from '../DevPage';
import { useRankData } from '../../hooks/useRankData';
import { useDispatch } from 'react-redux';
import { loadWinAuction } from '../../../store/auction/actions';
import { useAppSelector } from '../../hooks/useAppSelector';
import { checkMobile } from '../../../utils/checkMobile';

interface IRoutePage {
  page: string
}

export function RoutePage({ page }: IRoutePage) {
  const verified = useTgData();
  const { dataUser, loadingUser, errorUser } = useUserData();
  const token = useAppSelector<string>(state => state.token);
  const [mobile, setMobile] = useState(false);
  useRankData();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //@ts-ignore
  const tg = window.Telegram.WebApp;
  var BackButton = tg.BackButton;

  useEffect(() => {
    dispatch<any>(loadWinAuction());
  }, [token]);

  useEffect(() => {
    updateBackground(page);
    updateStyles();
    if(page === 'main') {
      BackButton.hide();
    } else {
      BackButton.show();
    }
  }, [page]);

  BackButton.onClick(function () {
    navigate(-1);
  });

  useEffect(() => {
    setMobile(checkMobile());
  }, []);

  return (
    <div>
      {!mobile ? <ErrorPage title='Войдите через мобильное устройство' text='Приложение доступно только в мобильном приложении Telegram.' isBtn={false} detail={''} /> : 
      <div>
          {!verified ? <WrongSourcePage /> : <div>
            { //@ts-ignore
              page === 'main' && (!loadingUser || dataUser.username) && !errorUser && dataUser.name && <ClickerPage name={dataUser.name} points={Number(dataUser.points)} img={dataUser.avatar} energy={Number(dataUser.energy)} />}
            {page === 'rating' && (!loadingUser || dataUser.username) && !errorUser && <RatingPage />}
            {page === 'referral' && (!loadingUser || dataUser.username) && !errorUser && <StoragePage />}
            {page === 'auction' && (!loadingUser || dataUser.username) && !errorUser && <AuctionPage />}
            {page === 'styles' && (!loadingUser || dataUser.username) && !errorUser && <StylesPage />}
            {page === 'dev' && <DevPage />}
            {(loadingUser) && <div className={styles.spinnerContainer}><Spinner color='#FFFFFF' size='50px' thickness='6px' className={styles.spinner} /></div>}
            {errorUser && !loadingUser && <ErrorPage detail={errorUser} />}
          </div>} 
      </div>  }
    </div>
  );
}
