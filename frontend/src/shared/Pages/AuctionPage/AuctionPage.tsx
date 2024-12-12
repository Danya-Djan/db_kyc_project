import React, { useEffect, useState } from 'react';
import styles from './auctionpage.module.css';
import { ETextStyles } from '../../texts';
import { AuctionCard } from '../../Auction/AuctionCard';
import { useAuctionData } from '../../hooks/useAuctionData';
import { Spinner } from '../../Elements/Spinner';
import { ErrorPage } from '../ErrorPage';

export function AuctionPage() {
  const { dataAuction, loadingAuction, errorAuction } = useAuctionData();
  const [auctionBlock, setAuctionBlock] = useState( <div></div> );

  useEffect(() => {
    if(dataAuction.length != 0) {
      const newBlock = dataAuction.map(item => {
        if (item.productName && item.productCover && item.initialCost && item.time && item.winnersNumber && item.commission && item.id && item.isLead != undefined && item.myBet != undefined)
          return <AuctionCard className={styles.card} auctionId={item.id} key={`${item.id}${JSON.stringify(dataAuction)}`} name={item.productName} imgs={[item.productCover]} users={item.winnersNumber} prevBet={item.initialCost} myBetInit={item.myBet} time={item.time} isLead={item.isLead} commission={item.commission}/>
      });

      //@ts-ignore
      setAuctionBlock(newBlock);
    }
  }, [dataAuction]);

  return (
    <div>
      {loadingAuction && <div className={styles.spinnerContainer}><Spinner color='#FFFFFF' size='40px' thickness='6px' className={styles.spinner} /></div>}
      {!loadingAuction && <div>
        {errorAuction ? <ErrorPage fullScreen={true} title='Возникла ошибка загрузки аукционов' text='Перезагрузите страницу или попробуйте позже' detail={errorAuction} /> :
        <div>
            <h1 className={styles.title} style={ETextStyles.RwSb26100}> <span>Соревнуйся за товары</span> на аукционе!</h1>
            {auctionBlock}
        </div>
        }
      </div>
      }
    </div>
  );
}
