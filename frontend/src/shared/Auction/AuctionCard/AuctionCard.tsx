import React, { useState } from 'react';
import styles from './auctioncard.module.css';
import { ETextStyles } from '../../texts';
import { PointsBlock } from '../../Elements/PointsBlock';
import { Button } from '../../Button';
import { EIcons } from '../../Icons';
import { Timer } from '../Timer';
import { formatNumber } from '../../../utils/formatNumber';
import { Slider } from '../../Elements/Slider';
import { ModalWindow } from '../../ModalWindow';
import { AuctionPopup } from '../AuctionPopup';
import { ResultAuctionPopup } from '../ResultAuctionPopup';
import { DevPopup } from '../../Elements/DevPopup';
import { useAppSelector } from '../../hooks/useAppSelector';

interface IAuctionCard {
  auctionId: string,
  name: string,
  imgs: Array<string>,
  users: number,
  prevBet: string,
  myBetInit: string,
  time: number,
  isLead: boolean,
  commission: number,
  className ?: string
}

export function AuctionCard({ name, imgs, users, prevBet, myBetInit, time, isLead, commission, auctionId, className }: IAuctionCard) {
  const [myBet, setBet] = useState(Number(myBetInit));
  const [myNewBet, setMyNewBet] = useState(0);
  const [initPrevBet, setPrevBet] = useState(prevBet);
  const [initLead, setLead] = useState(isLead);
  const [closeWindow, setClose] = useState(true);
  const [closeAnim, setCloseAnim] = useState(false);
  const [closeresultPopup, setCloseResultPopup] = useState(true);
  const styleIndex = Number(localStorage.getItem('selectedStyle'));
  const [closeErrorBet, setCloseErrorBet] = useState(true);

  return (
    <div className={`${styles.container} ${className} ${styleIndex===0 ? styles.darkContainer : styles.opacityContainer}`}>
      <Slider className={styles.slider} imgs={imgs}/>
      <h2 style={ETextStyles.InBd18120} className={styles.title}>{name}</h2>
      <h3 style={ETextStyles.RwSb16120} className={styles.title2}>Подробности аукциона</h3>
      <div className={`${styles.card} ${styles.cardFlex} ${styles.card1}`}>
        <p style={ETextStyles.RwRg14100}>Минимальная ставка</p>
        <PointsBlock points={initPrevBet} sizeIcon={20}/>
      </div>
      <div className={`${styles.card} ${styles.cardFlex} ${styles.card2}`}>
        <p style={ETextStyles.RwRg14100}>Количество победителей</p>
        <div className={styles.winnersNumber}>{users}</div>
      </div>
      <div className={`${styles.card} ${initLead && styles.leadCard}`}>
        <div className={styles.cardTop}>
          <div className={styles.cardLeft} style={ETextStyles.RwSb14120}>{initLead ? <p><span>Ты в числе победителей! </span>Но все может поменяться</p> 
            : <p>{myBet > 0 ? 'Вашу ставку перебили, повысьте ее, чтобы сохранить лидерство' : 'Успей сделать ставку! До конца осталось:' }</p> }</div>
          <Timer initTime={time}/>
        </div>
        <Button onClick={() => setClose(false)} text={myBet === 0 ? 'Сделать первую ставку' : <div className={styles.newBtn}>
          <p>Увеличить ставку</p>
          <div className={styles.prevText}>
            <p style={ETextStyles.InRg12140}>{`Предыдущая ставка — ${formatNumber(myBet)}`}</p>
            <div className={styles.icon} style={{ backgroundImage: "url('assets/btnIcon.png')"}}></div>
          </div>
        </div>} 
        icon={EIcons.UpPriceIcon}/>
      </div>
      {!closeWindow && <ModalWindow closeAnimOut={closeAnim} setCloseAnimOut={setCloseAnim} setClose={setClose} removeBtn={true} modalBlock={
        <AuctionPopup myBet={myBet} setCloseErrorBet={setCloseErrorBet} auctionId={auctionId} commission={commission} setLead={setLead} setClose={setCloseAnim} img={imgs[0]} name={name} prevBet={initPrevBet} prevUserImg={''} setBet={setMyNewBet} setCloseResultPopup={setCloseResultPopup}/>
      } />}
      {!closeresultPopup && closeErrorBet && <ModalWindow closeAnimOut={closeAnim} setCloseAnimOut={setCloseAnim} setClose={setCloseResultPopup} removeBtn={true} modalBlock={
        <ResultAuctionPopup prevBet={initPrevBet} prevMyBet={myBet} newBet={myNewBet} setBet={setBet} setClose={setCloseAnim} setCloseBetWindow={setClose} setPrevBet={setPrevBet}/>
      } />}
      {!closeErrorBet && <ModalWindow closeAnimOut={closeAnim} setCloseAnimOut={setCloseAnim} setClose={setCloseErrorBet} removeBtn={true} modalBlock={
        <DevPopup setClose={setCloseAnim} title='Возникла ошибка' text='Не получилось сделать ставку. Но мы скоро всё починим.' />
      } />}
    </div>
  );
}
