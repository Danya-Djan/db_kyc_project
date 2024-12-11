import React, { useEffect, useState } from 'react';
import styles from './pointszoom.module.css';
import { formatNumber } from '../../../utils/formatNumber';
import { ETextStyles } from '../../texts';
import ReactDOM from 'react-dom';

interface IPointsZoom {
  points: number,
  setClose(a:boolean): void,
  className ?: string,
  closePointsAnim: boolean,
  setClosePointsAnim(a: boolean): void
}

export function PointsZoom({ points, setClose, className, closePointsAnim, setClosePointsAnim }: IPointsZoom) {
  const [open, setOpen] = useState(true);
  const node = document.querySelector('#modal_root');
  if (!node) return null;

  useEffect(() => {
    const timer = setInterval(() => {
      setOpen(false);
      clearInterval(timer);
    }, 400);
  }, []);

  useEffect(() => {
    if (closePointsAnim) {
      const timer = setTimeout(() => {
        setClosePointsAnim(false);
        setClose(true);
        clearTimeout(timer);
      }, 400);
    }
  }, [closePointsAnim]);

  return (
    <div className={`${styles.container} ${className} ${open ? styles.animBack : ''} ${closePointsAnim ? styles.animBackClose : ''}`}>
      {ReactDOM.createPortal((
        <div className={`${styles.innerContainer} ${open ? styles.animBlock : ''} ${closePointsAnim ? styles.animBlockClose : ''}`}>
          <div className={styles.icon} style={{ backgroundImage: `url('assets/btnIcon.png')` }}></div>
          <p className={styles.point} style={ETextStyles.InSb18100}>{formatNumber(Number(points.toFixed(2)))}</p>
        </div>
      ), node)}
    </div>
  );
}
