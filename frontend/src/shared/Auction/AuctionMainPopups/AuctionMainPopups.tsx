import React, { useState } from 'react';
import styles from './auctionmainpopups.module.css';
import { ModalWindow } from '../../ModalWindow';
import { AuctionWinPopup } from '../AuctionWinPopup';
import { AuctionTopPopup } from '../AuctionTopPopup';
import { AuctionLosePopup } from '../AuctionLosePopup';

export function AuctionMainPopups() {
  const [closeWin, setCloseWin] = useState(true);
  const [closeTop, setCloseTop] = useState(true);
  const [closeLose, setCloseLose] = useState(true);
  const [closeAnim, setCloseAnim] = useState(false);

  const items = [
    {
      name: 'iPhone 15 Pro Max',
      img: '',
      bet: '788'
    },
    {
      name: 'iPhone 13 Pro',
      img: '',
      bet: '200'
    }
  ];

  return (
    <div>
      {!closeWin && <ModalWindow closeAnimOut={closeAnim} setCloseAnimOut={setCloseAnim} setClose={setCloseWin} removeBtn={true} modalBlock={
        <AuctionWinPopup name='iPhone 15 Pro Max ' img='' setClose={setCloseAnim}/>
      } />}
      {!closeTop && <ModalWindow closeAnimOut={closeAnim} setCloseAnimOut={setCloseAnim} setClose={setCloseTop} removeBtn={true} modalBlock={
        <AuctionTopPopup items={items} setClose={setCloseAnim}/>
      } />}
      {!closeLose && <ModalWindow closeAnimOut={closeAnim} setCloseAnimOut={setCloseAnim} setClose={setCloseLose} removeBtn={true} modalBlock={
        <AuctionLosePopup items={items} setClose={setCloseAnim} />
      } />}
    </div>
  );
}
