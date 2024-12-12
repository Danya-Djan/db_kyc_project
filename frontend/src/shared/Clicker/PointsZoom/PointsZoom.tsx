import React, { useEffect, useState } from 'react';
import styles from './pointszoom.module.css';
import { formatNumber } from '../../../utils/formatNumber';
import { ETextStyles } from '../../texts';
import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';
import { updatePointsRequestAsync } from '../../../store/me/actions';
import { checkIOS } from '../../../utils/checkMobile';

interface IPointsZoom {
  points: number,
  setClose(a:boolean): void,
  className ?: string,
  closePointsAnim: boolean,
  setClosePointsAnim(a: boolean): void,
  setCoins(a:number):void
}

export function PointsZoom({ points, setClose, setCoins, className, closePointsAnim, setClosePointsAnim }: IPointsZoom) {
  const [open, setOpen] = useState(true);
  const node = document.querySelector('#modal_root');
  if (!node) return null;
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setInterval(() => {
      setOpen(false);
      clearInterval(timer);
    }, 400);

    console.log(checkIOS())
  }, []);

  useEffect(() => {
    if (closePointsAnim) {
      dispatch<any>(updatePointsRequestAsync());
      const timer = setTimeout(() => {
        setClosePointsAnim(false);
        setClose(true);
        clearTimeout(timer);
        setCoins(0);
      }, 400);
    }
  }, [closePointsAnim]);

  return (
    <div className={`${styles.container} ${className} ${open ? styles.animBack : ''} ${closePointsAnim ? styles.animBackClose : ''}`}>
      {ReactDOM.createPortal((
        <div className={`${styles.innerContainer} ${open ? styles.animBlock : ''} ${closePointsAnim ? styles.animBlockClose : ''} ${checkIOS() && styles.ios}`}>
          <div className={styles.icon} style={{ backgroundImage: `url('assets/btnIcon.png')` }}></div>
          <p className={styles.point} style={ETextStyles.InSb18100}>{`+${formatNumber(Number(points.toFixed(2)))}`}</p>
        </div>
      ), node)}
    </div>
  );
}
