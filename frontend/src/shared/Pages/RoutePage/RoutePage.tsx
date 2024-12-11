import React, { useEffect } from 'react';
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

interface IRoutePage {
  page: string
}

export function RoutePage({ page }: IRoutePage) {
  const verified = useTgData();
  const { dataUser, loadingUser, errorUser } = useUserData();
  const navigate = useNavigate();
  //@ts-ignore
  const tg = window.Telegram.WebApp;
  var BackButton = tg.BackButton;

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

  return (
    <div>
      {!verified ? <WrongSourcePage /> : <div>
        { //@ts-ignore
        page === 'main' && !loadingUser && !errorUser && dataUser.name && <ClickerPage name={dataUser.name} points={Number(dataUser.points)} img={dataUser.avatar} energy={Number(dataUser.energy)}/>}
        {page === 'rating' && !loadingUser && !errorUser && <RatingPage />}
        {page === 'referral' && !loadingUser && !errorUser && <StoragePage />}
        {page === 'auction' && !loadingUser && !errorUser && <AuctionPage />}
        {page === 'styles' && !loadingUser && !errorUser && <StylesPage />}
        {(loadingUser) && <div className={styles.spinnerContainer}><Spinner color='#FFFFFF' size='50px' thickness='6px' className={styles.spinner} /></div> }
        {errorUser && !loadingUser && <ErrorPage detail={errorUser}/>}
      </div>} 
    </div>
  );
}
