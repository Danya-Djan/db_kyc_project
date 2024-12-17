import React, { useEffect, useState } from 'react';
import styles from './auctionmainpopups.module.css';
import { ModalWindow } from '../../ModalWindow';
import { AuctionWinPopup } from '../AuctionWinPopup';
import { AuctionTopPopup } from '../AuctionTopPopup';
import { AuctionLosePopup } from '../AuctionLosePopup';
import { useAppSelector } from '../../hooks/useAppSelector';
import { IAuctionItem } from '../../../store/me/actions';

export function AuctionMainPopups() {
  const [closeWin, setCloseWin] = useState(true);
  const [closeTop, setCloseTop] = useState(true);
  const [closeLose, setCloseLose] = useState(true);
  const [closeAnim, setCloseAnim] = useState(false);
  const topAuctions = useAppSelector<Array<IAuctionItem> | undefined>(state=>state.me.data.topAuctions);
  const loseAuctions = useAppSelector<Array<IAuctionItem> | undefined>(state => state.me.data.loseAuctions);
  const winAuctions = useAppSelector<Array<IAuctionItem> | undefined>(state => state.me.data.winAuctions);
  const [winInfo, setWinInfo] = useState<IAuctionItem>();

  useEffect(() => { 
    let showWindow = false;
    if (winAuctions && winAuctions.length != 0) {
      for (let i = 0; i < winAuctions.length; i++) {
        const winShow = localStorage.getItem('wS');
        if (winShow) {
          const winArray = JSON.parse(winShow);
          if (winArray && winArray.length != 0) {
            let isExist = false;
            for (let k = 0; k < winArray.length; k++) {
              if (Number(winArray[k]) === Number(winAuctions[i].id)) {
                isExist = true;
              }
            }
            if(!isExist) {
              winArray.push(winAuctions[i].id);
              localStorage.setItem('wS', JSON.stringify(winArray));
              showWindow = true;
              setWinInfo(winAuctions[i]);
            }
          } else {
            const newArray = [];
            newArray.push(winAuctions[i].id);
            localStorage.setItem('wS', JSON.stringify(newArray));
            showWindow = true;
            setWinInfo(winAuctions[i]);
          }
        } else {
          const newArray = [];
          newArray.push(winAuctions[i].id);
          localStorage.setItem('wS', JSON.stringify(newArray));
          showWindow = true;
          setWinInfo(winAuctions[i]);
        }
      }
    }

    if(showWindow) {
      setCloseWin(false);
    }

  }, [winAuctions]);

  useEffect(() => {
    const show = sessionStorage.getItem('shT');
    if (show === 't' && closeTop) {
      if (topAuctions && topAuctions.length != 0) {
        sessionStorage.setItem('shT', 'f');
        setCloseTop(false);
      }
    }
  }, [topAuctions]);

  useEffect(() => {
    const show = sessionStorage.getItem('shL');
    if (show === 't' && closeLose) {
      if (loseAuctions && loseAuctions.length != 0) {
        sessionStorage.setItem('shL', 'f');
        setCloseLose(false);
      }
    }
  }, [loseAuctions]);

  return (
    <div>
      {!closeWin && <ModalWindow closeAnimOut={closeAnim} setCloseAnimOut={setCloseAnim} setClose={setCloseWin} removeBtn={true} modalBlock={
        <AuctionWinPopup name={winInfo?.name ? winInfo?.name : ''} img={winInfo?.img ? winInfo?.img : ''} setClose={setCloseAnim}/>
      } />}
      {!closeTop && topAuctions != undefined && <ModalWindow closeAnimOut={closeAnim} setCloseAnimOut={setCloseAnim} setClose={setCloseTop} removeBtn={true} modalBlock={
        <AuctionTopPopup items={topAuctions} setClose={setCloseAnim}/>
      } />}
      {!closeLose && loseAuctions != undefined && <ModalWindow closeAnimOut={closeAnim} setCloseAnimOut={setCloseAnim} setClose={setCloseLose} removeBtn={true} modalBlock={
        <AuctionLosePopup items={loseAuctions} setClose={setCloseAnim} />
      } />}
    </div>
  );
}
