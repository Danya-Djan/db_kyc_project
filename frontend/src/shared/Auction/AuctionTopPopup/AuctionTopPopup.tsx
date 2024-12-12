import React from 'react';
import styles from './auctiontoppopup.module.css';
import { ETextStyles } from '../../texts';
import { ProductCard } from '../ProductCard';
import { Button } from '../../Button';
import { useNavigate } from 'react-router-dom';

interface IProduct {
  name: string,
  img: string,
  bet: string
}

interface IAuctionTopPopup {
  items: Array<IProduct>,
  setClose(a: boolean): void
}

export function AuctionTopPopup({ items, setClose }: IAuctionTopPopup) {
  const navigate = useNavigate();

  return (
    <div>
      <div className={styles.iconBlock}>
        <div className={styles.icon} style={{ backgroundImage: "url('assets/Fire.png')" }}></div>
      </div>
      <h2 className={styles.title} style={ETextStyles.RwSb24100}>Вы в топе</h2>
      <p className={styles.descr} style={ETextStyles.RwSb14120}>Кликайте, чтобы заработать больше очков и&nbsp;потратить их&nbsp;на&nbsp;ставку в&nbsp;аукционе.</p>
      <h3 className={styles.title2} style={ETextStyles.RwSb18120}>Аукционы, в которых вы лидируете:</h3>
      <div className={styles.cards}>
        {items.map(item => {
          return <ProductCard name={item.name} img={item.img} bet={item.bet} />
        })}
      </div>
      <Button text='Продолжить кликать' onClick={() => { navigate('/'); setClose(true)}}/>
    </div>
  );
}
