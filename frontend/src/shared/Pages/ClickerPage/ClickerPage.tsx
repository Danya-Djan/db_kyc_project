import React, { useEffect, useState } from 'react';
import styles from './clickerpage.module.css';
import { ClickerBtn } from '../../Clicker/ClickerBtn';
import { Profile } from '../../Clicker/Profile';
import { ETextStyles } from '../../texts';
import { SectionsBlock } from '../../Clicker/SectionsBlock';
import { ClickerFooter } from '../../Clicker/ClickerFooter';
import { StyleElements } from '../../Clicker/StyleElements';

interface IClickerPageInterface {
  name: string,
  points: number,
  energy: number,
  img: string
}

export function ClickerPage({ name, points, img, energy }: IClickerPageInterface) {
  const styleIndex = Number(localStorage.getItem('selectedStyle'));
  const [coins, setCoins] = useState(points);

  return (
    <div className={styles.container}>
      <div className={styles.records}>
        <Profile name={name} points={coins} className={styles.profile} img={img}/>
        <h1 style={ETextStyles.RwSb24100} className={styles.title}>Мои рекорды</h1>
        <SectionsBlock />
      </div>
      <div className={styles.clicker}>
        <ClickerBtn coins={coins} setCoins={setCoins} energy={energy}/>
      </div>
      <ClickerFooter />
      {styleIndex != 0 && <div>
        <StyleElements styleIndex={styleIndex}/>
      </div>}
    </div>
  );
}
