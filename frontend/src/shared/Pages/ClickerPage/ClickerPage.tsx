import React, { useEffect, useState } from 'react';
import styles from './clickerpage.module.css';
import { ClickerBtn } from '../../Clicker/ClickerBtn';
import { Profile } from '../../Clicker/Profile';
import { ETextStyles } from '../../texts';
import { SectionsBlock } from '../../Clicker/SectionsBlock';
import { ClickerFooter } from '../../Clicker/ClickerFooter';
import { StyleElements } from '../../Clicker/StyleElements';
import { PointsZoom } from '../../Clicker/PointsZoom';
import { useWindowSize } from 'usehooks-ts';
import { useAppSelector } from '../../hooks/useAppSelector';
import { ModalWindow } from '../../ModalWindow';
import { DevPopup } from '../../Elements/DevPopup';
import { AuctionMainPopups } from '../../Auction/AuctionMainPopups';
import { useAuctionData } from '../../hooks/useAuctionData';

interface IClickerPageInterface {
  name: string,
  points: number,
  energy: number,
  img: string
}

export function ClickerPage({ name, points, img, energy }: IClickerPageInterface) {
  const styleIndex = Number(localStorage.getItem('selectedStyle'));
  const [coins, setCoins] = useState(0);
  const [mult, setMult] = useState(1);
  const [closePoints, setClosePoints] = useState(true);
  const [closePointsAnim, setClosePointsAnim] = useState(false);
  const { width, height } = useWindowSize();
  const savedMult = useAppSelector<number>(state => state.mult);
  const [closeError, setCloseError] = useState(true);
  const [animClose, setAnimClose] = useState(false);
  const [initEnergy, setInitEnergy] = useState(energy);
  const [clickTime, setClickTime] = useState(0);
  const [closeAutoClick, setCloseAutoClick] = useState(true);
  const [sameCoords, setSameCoords] = useState(false);
  const [sameInterval, setSameInterval] = useState(false);
  useAuctionData();

  useEffect(() => {
    const html = document.querySelector('html');

    if(html) {
      html.style.overflow = 'scroll';
    }

  }, []);
 
  useEffect(() => {
    setMult(savedMult);
  }, [savedMult]);

  useEffect(() => {
    //@ts-ignore
    let timer;

    if (points !== coins && coins != 0) {
      setClosePoints(false);
      timer = setTimeout(() => {
        setClosePointsAnim(true);
      }, 2000);
    }
    return () => {
      //@ts-ignore
      clearTimeout(timer);
    };
  }, [coins]);
  
  return (
    <div className={styles.container}>
      <div className={styles.records}>
        {!closePoints && <PointsZoom sameInterval={sameInterval} setSameInterval={setSameInterval} sameCoords={sameCoords} setSameCoords={setSameCoords} setCloseAutoClick={setCloseAutoClick} setClickTime={setClickTime} clickTime={clickTime} setMult={setMult} setEnergy={setInitEnergy} setCloseError={setCloseError} setCoins={setCoins} points={coins} setClosePointsAnim={setClosePointsAnim} setClose={setClosePoints} className={styles.pointsAnim} closePointsAnim={closePointsAnim}/>}
        <Profile name={name} className={styles.profile} img={img}/>
        <h1 style={ETextStyles.RwSb24100} className={styles.title}>Мои рекорды</h1>
        <SectionsBlock mult={mult}/>
      </div>
      <div className={styles.clicker} style={{height: `${height > 670 && 'calc(100vh - 355px)'}`}}>
        <ClickerBtn setSameInterval={setSameInterval} closeAutoClick={closeAutoClick} sameCoords={sameCoords} setSameCoords={setSameCoords} clickTime={clickTime} setClickTime={setClickTime} setEnergy={setInitEnergy} coins={coins} setCoins={setCoins} energy={initEnergy} setMult={setMult}/>
      </div>
      <ClickerFooter />
      {styleIndex != 0 && <div>
        <StyleElements styleIndex={styleIndex}/>
      </div>}
      {!closeError && <ModalWindow removeBtn={true} setCloseAnimOut={setAnimClose} closeAnimOut={animClose} setClose={setCloseError} modalBlock={
        <DevPopup setClose={setAnimClose} title='Возникла ошибка' text='Мы пока не можем принимать клики, но скоро всё починим.' />
      } />}
      {!closeAutoClick && <ModalWindow removeBtn={true} setCloseAnimOut={setAnimClose} closeAnimOut={animClose} setClose={setCloseAutoClick} modalBlock={
        <DevPopup setClose={setAnimClose} title='Кажется, вы используете автокликер...' text='Ваши клики не отправлены. Давайте играть честно.' img='assets/police.gif'/>
      } />}
      <AuctionMainPopups/>
    </div>
  );
}
