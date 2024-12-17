import React, { useEffect, useState } from 'react';
import styles from './pointszoom.module.css';
import { formatNumber } from '../../../utils/formatNumber';
import { ETextStyles } from '../../texts';
import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';
import { IUserData, meRequest, meRequestSuccess, updateEnergyRequestAsync, updatePointsRequestAsync } from '../../../store/me/actions';
import { checkIOS } from '../../../utils/checkMobile';
import axios from 'axios';
import { useAppSelector } from '../../hooks/useAppSelector';
import { saveMult } from '../../../store/mult';
import { sendAutoClickData } from '../../hooks/sendAutoClickData';

interface IPointsZoom {
  points: number,
  setClose(a: boolean): void,
  className?: string,
  closePointsAnim: boolean,
  setClosePointsAnim(a: boolean): void,
  setCoins(a: number): void,
  setCloseError(a: boolean): void,
  setEnergy(a: number): void,
  setMult(a: number): void,
  setClickTime(a: number): void,
  clickTime: number,
  setCloseAutoClick(a: boolean): void,
  sameCoords: boolean,
  setSameCoords(a: boolean): void,
  setSameInterval(a: boolean): void,
  sameInterval: boolean,
}

export function PointsZoom({ points, sameInterval, setSameInterval, sameCoords, setSameCoords, setCloseAutoClick, setMult, setClose, setCoins, className, closePointsAnim, setClosePointsAnim, setCloseError, setEnergy, clickTime, setClickTime }: IPointsZoom) {
  const [open, setOpen] = useState(true);
  const node = document.querySelector('#modal_root');
  const urlClick = useAppSelector<string>(state => state.urlClick);
  const token = useAppSelector<string>(state => state.token);
  const [sizeHand, setSizeHand] = useState(30);
  const energy = Number(useAppSelector<string | undefined>(state => state.me.data.energy));
  const userData = useAppSelector<IUserData>(state => state.me.data);
  const URL = useAppSelector<string>(state => state.url);
  if (!node) return null;
  const dispatch = useDispatch();

  const sendClicks = () => {
    const initPoints = points;
    const clickTimeInit = clickTime;
    let initSameCoords = sameCoords;
    let initSameInterval = sameInterval;
    let avtTime = 500;
    if (points > 1) {
      avtTime = clickTimeInit / initPoints;
    }

    setClickTime(0);
    setSameCoords(false);

  
    if ((avtTime < 100 && initPoints > 20) || (avtTime < 130 && initPoints > 300)) {

      axios.post(`${URL}/api/v1/users/warn/`, {}, {
        headers: {
          "Authorization": `TelegramToken ${token}`
        }
      }).then(resp => {
        //console.log(resp);
      }).catch(err => {
        //console.log(err)
      })
      //sendAutoClickData(userData.tgId, points, avtTime);
      setCloseAutoClick(false);
      setSameInterval(false);
      const returnEnergy = energy + initPoints;
      setEnergy(returnEnergy);
      dispatch<any>(updateEnergyRequestAsync(returnEnergy));
    } else {
      dispatch(meRequest());
      axios.post(`${urlClick}/api/v1/batcher/batch-click/`,
        {
          count: initPoints
        },
        {
          headers: {
            "Authorization": `TelegramToken ${token}`
          }
        }
      ).then(resp => {
        const data = resp.data;
        const click = Number(data.click.value);
        const encodeMult = btoa(click.toString());
        sessionStorage.setItem('mt', encodeMult);
        setMult(Number(click.toFixed(2)));
        const energy = Number(data.energy);
        dispatch<any>(saveMult(Number(click.toFixed(2))));
        dispatch<any>(updateEnergyRequestAsync(energy));
        dispatch<any>(updatePointsRequestAsync());
      }).catch(err => {
        console.log(err);
        setCloseError(false);
        const returnEnergy = energy + initPoints;
        setEnergy(returnEnergy);
        dispatch<any>(updateEnergyRequestAsync(returnEnergy));
        dispatch(meRequestSuccess(userData));
      })
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setOpen(false);
      clearInterval(timer);
    }, 400);
  }, []);

  useEffect(() => {
    if (closePointsAnim) {
      sendClicks();
      const timer = setTimeout(() => {
        setClosePointsAnim(false);
        setClose(true);
        clearTimeout(timer);
        setCoins(0);
      }, 400);
    }
  }, [closePointsAnim]);

  useEffect(() => {
    setSizeHand(25);
    const timer = setTimeout(() => {
      setSizeHand(30);
    }, 100);

    return () => clearTimeout(timer);
  }, [points]);

  return (
    <div className={`${styles.container} ${className} ${open ? styles.animBack : ''} ${closePointsAnim ? styles.animBackClose : ''}`}>
      {ReactDOM.createPortal((
        <div className={`${styles.innerContainer} ${open ? styles.animBlock : ''} ${closePointsAnim ? styles.animBlockClose : ''} ${checkIOS() && styles.ios}`}>
          <div className={styles.icon} style={{ backgroundImage: `url('assets/point.png')`, width: `${sizeHand}px`, height: `${sizeHand}px` }}></div>
          <p className={styles.point} style={ETextStyles.InSb18100}>{`${formatNumber(Number(points.toFixed(2)))}`}</p>
        </div>
      ), node)}
    </div>
  );
}
