import React, { useEffect, useRef, useState } from 'react';
import styles from './clickerbtn.module.css';
import { ModalWindow } from '../../ModalWindow';
import { ClickerPopup } from '../ClickerPopup';
import { getGradient } from '../../../utils/getGradient';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useDispatch } from 'react-redux';
import { updateEnergyRequestAsync } from '../../../store/me/actions';

interface IClickerBtn {
  coins: number,
  setCoins(a: number): void,
  energy: number,
  setMult(a: number): void,
  setEnergy(a: number): void,
  setClickTime(a: number): void,
  clickTime: number,
  sameCoords: boolean,
  setSameCoords(a: boolean): void,
  closeAutoClick: boolean
}

export function ClickerBtn({ setCoins, closeAutoClick, energy, setMult, coins, setEnergy, setClickTime, clickTime, setSameCoords }: IClickerBtn) {
  const [fill, setFill] = useState(0);
  const [size, setSize] = useState(240);
  const circumference = 2 * Math.PI * 125;
  const dashArray = fill * circumference / 100;
  const img = fill < 100 ? '/assets/imgBtn1.png' : '/assets/imgBtn2.png';
  const [close, setClose] = useState(true);
  const [gradient, setGradient] = useState(getGradient());
  let styleIndex = useAppSelector<number>(state => state.styleIndex);
  const [maxEnergy, setMaxEnergy] = useState(500);
  const dispatch = useDispatch();
  const [prevClickTime, setPrevClickTime] = useState(0);
  const [prevCoords, setPrevCoords] = useState(0);

  useEffect(() => {
    if(!closeAutoClick) {
      setClose(true);
    }
  }, [closeAutoClick]);
  

  useEffect(() => {
    if(clickTime === 0) {
      setPrevClickTime(0);
      setPrevCoords(0);
    }
  }, [clickTime]);

  useEffect(() => {
    setFill((maxEnergy - energy) / maxEnergy * 100);
  }, [energy]);

  useEffect(() => {
    const savedEnergy = sessionStorage.getItem('eg');
    if(savedEnergy) {
      const encodeEnergy = atob(savedEnergy);
      setMaxEnergy(Number(encodeEnergy));
    }
    setFill((maxEnergy - energy) / maxEnergy * 100);
  }, []);

  useEffect(() => {
    setGradient(getGradient())
  }, [styleIndex]);

  const btnClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const x = event.nativeEvent.offsetX;
    const y = event.nativeEvent.offsetY;

    const coords = x*y;
    if (coords === prevCoords) {
      setSameCoords(true);
    } else {
      setSameCoords(false);
    }
    setPrevCoords(coords);

    const currentTime = Date.now();
    const clickInterval = currentTime - prevClickTime;
    if(prevClickTime != 0) {
      setClickTime(clickTime + clickInterval);
    }
    setPrevClickTime(currentTime);

    if (energy != 0) {
      const newEnergy = energy - 1;
      const newFill = (maxEnergy - newEnergy) / maxEnergy * 100;
      const newCoins = coins + 1;
      dispatch<any>(updateEnergyRequestAsync(newEnergy));
      setCoins(newCoins);
      setEnergy(newEnergy)
      setFill(newFill);

      if (newFill < 100) {
        setSize(220);

        const timer = setTimeout(() => {
          setSize(240);
          clearTimeout(timer);
        }, 100);
      } else {
        setClose(false);
      }
    } else {
      setClose(false);
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
      text: <span>Чтобы охладиться, нужно закрыть приложение, нажав по&nbsp;кнопке ниже.</span>,
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
      {!close && !closeAutoClick && <ModalWindow setCloseAnimOut={setClose} removeBtn={true} setClose={setClose} modalBlock={
        <ClickerPopup title='Кнопка перегрелась' cards={hotCards} setClose={setClose} isBtn={true}/>
      } />}
    </div>
  );
}
