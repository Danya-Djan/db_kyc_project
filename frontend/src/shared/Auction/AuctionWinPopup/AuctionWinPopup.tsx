import React, { useState } from 'react';
import styles from './auctionwinpopup.module.css';
import { ETextStyles } from '../../texts';
import { Button } from '../../Button';
import { PersonIcon } from '../../Elements/PersonIcon';
import { useNavigate } from 'react-router-dom';
import { ConfettiAnim } from '../Confetti';

interface IAuctionWinPopup {
  name: string,
  img: string,
  setClose(a: boolean): void
}

export function AuctionWinPopup({ name, img, setClose }: IAuctionWinPopup) {
  const navigate = useNavigate();
  const [startConfetti, setStartConfetti] = useState(0);
  const [removeConfetti, setRemoveConfetti] = useState(false);

  return (
    <div>
      <div className={styles.iconBlock}>
        <div className={styles.icon} style={{backgroundImage: "url('assets/Gift.png')"}}></div>
      </div>
      <h2 className={styles.title} style={ETextStyles.RwSb24100}>Вы выиграли в аукционе!</h2>
      <p className={styles.descr} style={ETextStyles.RwSb14120}>Поздравляем!!! Приз, за&nbsp;который вы&nbsp;так упорно боролись, теперь ваш. Ожидайте сообщение в&nbsp;Telegram от&nbsp;нашей команды.</p>
      <h3 className={styles.title2} style={ETextStyles.RwSb18120}>Ваш приз</h3>
      <Button className={styles.productWin} text={name} icon={<PersonIcon img={img} />} onClick={() => setStartConfetti(1)}/>
      <Button text='Продолжить кликать' stroke={true} onClick={() => { navigate('/'); setClose(true); setRemoveConfetti(true)}}/>
      {!removeConfetti && <ConfettiAnim opacity={startConfetti} setOpacity={setStartConfetti}/>}
    </div>
  );
}
