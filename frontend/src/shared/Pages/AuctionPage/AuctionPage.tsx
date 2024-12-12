import React, { useEffect } from 'react';
import styles from './auctionpage.module.css';
import { ETextStyles } from '../../texts';
import { AuctionCard } from '../../Auction/AuctionCard';

export function AuctionPage() {
  const imgs = ['https://cdn.dribbble.com/userupload/11863775/file/original-6009708366fadd352f61fbaf0db5acee.png?resize=1200x853',
    'https://cdn.dribbble.com/userupload/10040892/file/original-850d482568c1f1c870b7066113903bd2.png?resize=1200x900',
    'https://cdn.dribbble.com/users/9735273/screenshots/19338580/media/6657322ea7990bd504427ed1b171be3d.png?resize=1200x900']

  return (
    <div>
      <h1 className={styles.title} style={ETextStyles.RwSb26100}> <span>Соревнуйся за товары</span> на аукционе!</h1>
      <AuctionCard name='iPhone 15 Pro Max, 256gb, Natural Titanium' imgs={imgs} minBet='200' users={23} prevBet='290' myBetInit='0' time={86400} isLead={false}/>
    </div>
  );
}
