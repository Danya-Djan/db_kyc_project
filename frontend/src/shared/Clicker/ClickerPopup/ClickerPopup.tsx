import React from 'react';
import styles from './clickerpopup.module.css';
import { ETextStyles } from '../../texts';
import { PopupCard } from '../../Elements/PopupCard';
import { generateRandomString } from '../../../utils/generateRandom';

interface ICardInterface {
  title: string,
  text: string | React.ReactNode,
  img: string
}

interface IClickerPopup {
  title: string,
  cards: Array<ICardInterface>,
  setClose(a: boolean): void,
  text ?: string
}

export function ClickerPopup({ title, cards, text }: IClickerPopup) {

  const blockCards = cards.map((item) => {
    return <PopupCard key={generateRandomString()} title={item.title} text={item.text} img={item.img}/>
  });

  return (
    <div>
      <h2 style={ETextStyles.RwSb24100} className={styles.title}>{title}</h2>
      <div className={styles.cards}>{blockCards}</div>
      {text && <p className={styles.text}>{text}</p> }
    </div>
  );
}
