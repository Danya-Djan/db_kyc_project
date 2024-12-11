import React, { useEffect, useState } from 'react';
import styles from './clickerbtn.module.css';
import { ModalWindow } from '../../ModalWindow';
import { ClickerPopup } from '../ClickerPopup';
import { getGradient } from '../../../utils/getGradient';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useDispatch } from 'react-redux';
import { updateCoinsRequestAsync } from '../../../store/me/actions';
import axios from 'axios';
import { DevPopup } from '../../Elements/DevPopup';
import { saveMult } from '../../../store/mult';

interface IClickerBtn {
  coins: number,
  setCoins(a: number): void,
  energy: number,
  setMult(a: number): void
}

export function ClickerBtn({ coins, setCoins, energy, setMult }: IClickerBtn) {
  const urlClick = useAppSelector<string>(state => state.urlClick);
  const token = useAppSelector<string>(state => state.token);
  const [fill, setFill] = useState(0);
  const [size, setSize] = useState(240);
  const circumference = 2 * Math.PI * 125;
  const dashArray = fill * circumference / 100;
  const img = fill < 100 ? '/assets/imgBtn1.png' : '/assets/imgBtn2.png';
  const [close, setClose] = useState(true);
  const [gradient, setGradient] = useState(getGradient());
  let styleIndex = useAppSelector<number>(state => state.styleIndex);
  const [initEnergy, setEnergy] = useState(energy);
  //const maxEnergy = Number(localStorage.getItem('eg'));
  const [maxEnergy, setMaxEnergy] = useState(500);
  const [closeError, setCloseError] = useState(true);
  const [error, setError] = useState(false);
  const [animClose, setAnimClose] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const savedEnergy = sessionStorage.getItem('eg');
    if(savedEnergy) {
      const encodeEnergy = atob(savedEnergy);
      setMaxEnergy(Number(encodeEnergy));
    }
    setFill((maxEnergy - initEnergy) / maxEnergy * 100);
  }, []);

  useEffect(() => {
    setGradient(getGradient())
  }, [styleIndex]);

  const btnClick = () => {
    if (!(initEnergy === 0)) {
      sendClick();
    } else {
      setClose(false);
    }
  };

  const sendClick = () => {
    if(token) {
      axios.post(`${urlClick}/api/v1/click/`,
        {}, 
        {
          headers: {
            "Authorization": `TelegramToken ${token}`
          }
        }
      ).then((resp) => {
        //console.log(resp);
        if(resp.data) {
          const click = Number(resp.data.click.value);
          //
          const encodeMult = btoa(click.toString());
          sessionStorage.setItem('mt', encodeMult);
          //
          const newEnergy = Number(resp.data.energy);
          setMult(Number(click.toFixed(2)))
          dispatch<any>(saveMult(Number(click.toFixed(2))));
          const newFill = (maxEnergy - newEnergy) / maxEnergy * 100;
          if (newFill <= 100) {
            const newCoins = Number(coins + click);
            dispatch<any>(updateCoinsRequestAsync(newCoins, newEnergy))
            setCoins(newCoins);
            setEnergy(newEnergy)
            setFill(newFill);
          } else {
            setFill(100);
          }

          if (newFill < 100) {
            setSize(220);

            const timer = setTimeout(() => {
              setSize(240);
              clearTimeout(timer);
            }, 100);
          } else {
            setClose(false);
          }
          //
        }
        if(error) {
          setError(false)
        }
      }).catch((err) => {
        setCloseError(false);
        setError(true);
        console.log(err);
      })
    }
  };


  const hotCards = [
    {
      title: 'Ты большой молодец',
      text: <span>Твоя концентрация на&nbsp;высоте, ты&nbsp;перегрел кнопку на&nbsp;15% сильнее остальных игроков, на&nbsp;столько&nbsp;же уголь Max Flow дает жар сильнее, чем остальные.</span>,
      img: 'assets/Biceps.png'
    },
    {
      title: 'Как продолжить кликать',
      text: <span>Чтобы охладиться, нужно нужно закрыть приложение, нажав по&nbsp;кнопке ниже.</span>,
      img: 'assets/Monocle.png'
    },
    {
      title: 'Что дальше',
      text: <span>Затем ты&nbsp;сможешь открыть приложение заново и&nbsp;продолжить поддерживать свою большую концентрацию.</span>,
      img: 'assets/Rocket.png'
    },
  ];

  return (
    <div className={styles.ringContainer}>
      <div className={`${styles.ringBig} ${fill === 100 && styles.borderNone}`}></div>
      <div className={`${styles.ringSmall} ${fill === 100 && styles.borderNone}`} style={{ backgroundImage: `url(${img})`, backgroundSize: `${size}px` }} onClick={btnClick}></div>
      <svg className={styles.svg} width="270" height="270" viewBox="0 0 270 270" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="135" cy="135" r="125" stroke={fill < 100 ? "url(#paint0_linear_619_10702)" : '#FF0000'} strokeWidth="20" strokeLinecap="round" style={{ strokeDasharray: `${dashArray} ${circumference}` }} />
        <defs>
          {gradient}
        </defs>
      </svg>
      {!close && <ModalWindow setCloseAnimOut={setClose} removeBtn={true} setClose={setClose} modalBlock={
        <ClickerPopup title='Кнопка перегрелась' cards={hotCards} setClose={setClose} isBtn={true}/>
      } />}
      {!closeError && <ModalWindow removeBtn={true} setCloseAnimOut={setAnimClose} closeAnimOut={animClose} setClose={setCloseError} modalBlock={
        <DevPopup setClose={setAnimClose} type='error'/>
      } />}
    </div>
  );
}
