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
        {!closePoints && <PointsZoom setMult={setMult} setEnergy={setInitEnergy} setCloseError={setCloseError} setCoins={setCoins} points={coins} setClosePointsAnim={setClosePointsAnim} setClose={setClosePoints} className={styles.pointsAnim} closePointsAnim={closePointsAnim}/>}
        <Profile name={name} className={styles.profile} img={img}/>
        <h1 style={ETextStyles.RwSb24100} className={styles.title}>Мои рекорды</h1>
        <SectionsBlock mult={mult}/>
      </div>
      <div className={styles.clicker} style={{height: `${height > 670 && 'calc(100vh - 355px)'}`}}>
        <ClickerBtn setEnergy={setInitEnergy} coins={coins} setCoins={setCoins} energy={initEnergy} setMult={setMult}/>
      </div>
      <ClickerFooter />
      {styleIndex != 0 && <div>
        <StyleElements styleIndex={styleIndex}/>
      </div>}
      {!closeError && <ModalWindow removeBtn={true} setCloseAnimOut={setAnimClose} closeAnimOut={animClose} setClose={setCloseError} modalBlock={
        <DevPopup setClose={setAnimClose} title='Возникла ошибка' text='Мы пока не можем принимать клики, но скоро всё починим.' />
      } />}
    </div>
  );
}
