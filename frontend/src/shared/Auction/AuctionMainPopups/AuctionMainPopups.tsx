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
        <AuctionWinPopup name='iPhone 15 Pro Max ' img='' setClose={setCloseAnim}/>
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
