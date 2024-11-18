import React, { useEffect, useState } from 'react';
import styles from './resultauctionpopup.module.css';
import { declension } from '../../../utils/declension';
import { ETextStyles } from '../../texts';
import { PointsBlock } from '../../Elements/PointsBlock';
import { Button } from '../../Button';

interface IResultAuctionPopup {
  prevBet: string,
  prevMyBet: number,
  newBet: number,
  setBet(a: number): void,
  setClose(a: boolean): void,
  setCloseBetWindow(a: boolean): void
  setPrevBet(a: string): void,
}

export function ResultAuctionPopup({ prevBet, prevMyBet, newBet, setBet, setClose, setCloseBetWindow, setPrevBet }: IResultAuctionPopup) {
  const [diff, setDiff] = useState(0);
  const [prevBetOld, setPrevBetOld] = useState(prevBet);


  useEffect(() => {
    setDiff(newBet - prevMyBet);
    setBet(newBet);
    setPrevBet(newBet.toString())
  }, []);

  const onClick = () => {
    setClose(true);
    const timer = setInterval(() => {
      setCloseBetWindow(false);
      clearInterval(timer);
    }, 400);
  };
  
  return (
    <div>
      <div className={styles.topIcon}>
        <div className={styles.icon} style={{backgroundImage: 'url("assets/Money.png")'}}></div>
      </div>
      <div className={styles.text} style={ETextStyles.InSb24100}>
        Вы <span>увеличили</span> ставку <span>{`на ${diff}`}</span> {declension(diff, 'коин', 'коина', 'коинов')}
      </div>
      <div className={styles.cards}>
        <div className={styles.card}>
          <p style={ETextStyles.RwSb16120}>Сколько вы потратили</p>
          <PointsBlock left={true} points={newBet.toString()} className={styles.colorPoints}/>
        </div>
        <div className={styles.card}>
          <p style={ETextStyles.RwSb16120}>Предыдущая ставка</p>
          <PointsBlock left={true} points={prevBetOld.toString()} />
        </div>
      </div>
      <Button text='Увеличить шанс на выигрыш' onClick={() => onClick()}/>
    </div>
  );
}
