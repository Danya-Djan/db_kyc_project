import React, { useState } from 'react';
import styles from './auctionpopup.module.css';
import { ETextStyles } from '../../texts';
import { Button } from '../../Button';
import { EIcons } from '../../Icons';
import { declension } from '../../../utils/declension';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from '../ProductCard';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { updatePointsRequestAsync } from '../../../store/me/actions';
import { updateAuction } from '../../../store/auction/actions';

interface IAuctionPopup {
  auctionId: string,
  setClose(a: boolean): void,
  setLead(a: boolean): void,
  img: string,
  name: string,
  prevBet: string,
  prevUserImg: string,
  setBet(a: number): void,
  setCloseResultPopup(a: boolean): void,
  commission: number,
  setCloseErrorBet(a: boolean): void,
  myBet: number
}

export function AuctionPopup({ setClose, setCloseErrorBet, auctionId, img, name, prevBet, prevUserImg, setBet, setLead, setCloseResultPopup, commission, myBet }: IAuctionPopup) {
  const [value, setValue] = useState<string>('');
  const [disabled, setDis] = useState(true);
  const [autoBet, setAutoBet] = useState(false);
  const navigate = useNavigate();
  const [percent, setPercent] = useState(commission);
  const userPoints = Number(useAppSelector<string | undefined>(state=>state.me.data.points));
  const URL = useAppSelector<string>(state=>state.url);
  const token = useAppSelector<string>(state => state.token);
  const dispatch = useDispatch();


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = event.target.value;
    newValue = newValue.replace(/[^0-9]/g, '');
    setValue(newValue);

    if (newValue.length != 0) {
      setDis(false);
    } else {
      setDis(true);
    }
  }

  const newBet = () => {
    const bet = Number(value);
    setClose(true);

    if (token) {
      axios.post(`${URL}/api/v1/auction/auction/${auctionId}/place-bet/?value=${bet}`, {},
        {
          headers: {
            "Authorization": `TelegramToken ${token}`
          }
        }
      ).then(resp => {
        const data = resp.data;
        dispatch<any>(updatePointsRequestAsync());
        dispatch<any>(updateAuction(auctionId));
        setBet(bet);
        //setLead(true);
        const timer = setInterval(() => {
          setCloseResultPopup(false);
          clearTimeout(timer);
        }, 400);
      }).catch(err => {
        setCloseErrorBet(false);
      })
    }
  };

  return (
    <div>
      <h2 className={styles.title} style={ETextStyles.RwSb24100}>Сделать ставку</h2>
      <ProductCard name={name} img={img} bet={prevBet} personImg={prevUserImg} className={styles.card} />
      {!autoBet ? <Button onClick={() => { setAutoBet(true), setValue(Number(Number((1 + percent / 100) * Number(prevBet)).toFixed(2)).toString()), setDis(false) }} text='Сразу перебить ставку' className={styles.btnFirst} icon={<div className={styles.icon} style={{ backgroundImage: "url('assets/Rocket.png')" }}></div>} /> :
        <button style={ETextStyles.InBd14120} className={styles.btnCancel} onClick={() => setClose(true)}>Не перебивать</button>
      }
      <p className={styles.descr} style={ETextStyles.RwRg10140}>Наши алгоритмы автоматически рассчитают стоимость, чтобы ваша ставка стала самой высокой</p>
      <h3 className={styles.title2} style={ETextStyles.InSb14120}>{!autoBet ? 'Ввести свою цену' : 'Цена, чтобы перебить ставку'}</h3>
      <input style={ETextStyles.InSb14120} className={styles.input} value={value} type="text" onChange={handleChange} inputMode="numeric" />
      {(Number(Number((1 + percent / 100) * Number(value))) - myBet < userPoints) ? ((Number(value) < Number(prevBet) && value.length > 0) ? 
        <button className={styles.btnForbidden}>
          <p style={ETextStyles.InBd14120}>Ставка должна быть больше</p>
          <p style={ETextStyles.InRg12140} className={styles.textForbidden}>Нельзя сделать ставку меньше предыдущей</p>
        </button>
      : <Button onClick={() => newBet()} disabled={disabled} text={disabled ? 'Перебить ставку' : <div className={styles.newBtn}>
          <p>Перебить ставку</p>
          <div className={styles.btnText}>
            <p style={ETextStyles.InRg12140}>{`${declension(value, 'коин', 'коина', 'коинов', true)} + ${percent}% = ${declension(Number(Number((1 + percent / 100) * Number(value)).toFixed(2)), 'коин', 'коина', 'коинов', true)}`}</p>
            <div className={styles.icon} style={{ backgroundImage: "url('assets/btnIcon.png')" }}></div>
          </div>
        </div>}
          icon={EIcons.UpPriceIcon} />
    ) :
        <button className={styles.btnForbidden} onClick={() => navigate('/')}>
          <p style={ETextStyles.InBd14120}>Тебе не хватает очков</p>
          <div className={styles.btnText}>
            <p style={ETextStyles.InRg12140} className={styles.textForbidden}>Нажми сюда, чтобы накопить еще</p>
            <div className={styles.icon} style={{ backgroundImage: "url('assets/btnIcon.png')" }}></div>
          </div>
        </button>
      }
    </div>
  );
}
