import React, { useEffect, useState } from 'react';
import styles from './clickerpage.module.css';
import { ClickerBtn } from '../../Clicker/ClickerBtn';
import { Profile } from '../../Clicker/Profile';
import { ETextStyles } from '../../texts';
import { SectionsBlock } from '../../Clicker/SectionsBlock';
import { ClickerFooter } from '../../Clicker/ClickerFooter';
import { StyleElements } from '../../Clicker/StyleElements';
import { PointsZoom } from '../../Clicker/PointsZoom';
import { Timer } from '../../Auction/Timer';
import { useWindowSize } from 'usehooks-ts';
import { useAppSelector } from '../../hooks/useAppSelector';

interface IClickerPageInterface {
  name: string,
  points: number,
  energy: number,
  img: string
}

export function ClickerPage({ name, points, img, energy }: IClickerPageInterface) {
  const styleIndex = Number(localStorage.getItem('selectedStyle'));
  const [coins, setCoins] = useState(points);
  const [mult, setMult] = useState(1);
  const [closePoints, setClosePoints] = useState(true);
  const [closePointsAnim, setClosePointsAnim] = useState(false);
  const { width, height } = useWindowSize();
  const savedMult = useAppSelector<number>(state => state.mult);

  useEffect(() => {
    setMult(savedMult);
  }, [savedMult]);

  useEffect(() => {
    //@ts-ignore
    let timer;

    if (points !== coins) {
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
        {!closePoints && <PointsZoom points={coins} setClosePointsAnim={setClosePointsAnim} setClose={setClosePoints} className={styles.pointsAnim} closePointsAnim={closePointsAnim}/>}
        <Profile name={name} points={coins} className={styles.profile} img={img}/>
        <h1 style={ETextStyles.RwSb24100} className={styles.title}>Мои рекорды</h1>
        <SectionsBlock mult={mult}/>
      </div>
      <div className={styles.clicker} style={{height: `${height > 670 && 'calc(100vh - 355px)'}`}}>
        <ClickerBtn coins={coins} setCoins={setCoins} energy={energy} setMult={setMult}/>
      </div>
      <ClickerFooter />
      {styleIndex != 0 && <div>
        <StyleElements styleIndex={styleIndex}/>
      </div>}
    </div>
  );
}
