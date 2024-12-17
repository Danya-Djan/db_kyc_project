import React from 'react';
import styles from './auctionlosepopup.module.css';
import { useNavigate } from 'react-router-dom';
import { ETextStyles } from '../../texts';
import { ProductCard } from '../ProductCard';
import { Button } from '../../Button';
import { generateRandomString } from '../../../utils/generateRandom';

interface IProduct {
  name: string,
  img: string,
  bet: string
}

interface IAuctionLosePopup {
  items: Array<IProduct>,
  setClose(a: boolean): void
}

export function AuctionLosePopup({ items, setClose }: IAuctionLosePopup) {
  const navigate = useNavigate();
  return (
    <div>
      <div className={styles.iconBlock}>
        <div className={styles.icon} style={{ backgroundImage: "url('assets/Angry.png')" }}></div>
      </div>
      <h2 className={styles.title} style={ETextStyles.RwSb24100}>Вы больше не в топе...</h2>
      <p className={styles.descr} style={ETextStyles.RwSb14120}>Чтобы сохранить лидерство, повысьте свою ставку в&nbsp;аукционе.</p>
      <h3 className={styles.title2} style={ETextStyles.RwSb18120}>Аукционы, в&nbsp;которых нужно увеличить ставку:</h3>
      <div className={styles.cards}>
        {items.map(item => {
          return <ProductCard key={ generateRandomString() } name={item.name} img={item.img} bet={item.bet} />
        })}
      </div>
      <Button text='Увеличить ставку' onClick={() => { navigate('/auction'); setClose(true) }} />
    </div>

  );
}
