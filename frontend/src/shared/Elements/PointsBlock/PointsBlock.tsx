import React from 'react';
import styles from './pointsblock.module.css';
import { ETextStyles } from '../../texts';
import { formatNumber } from '../../../utils/formatNumber';

interface IPointsBlock {
  points: string,
  className ?: string,
  sizeText?: number
  sizeIcon?: number,
  left ?: boolean
}

export function PointsBlock({ points, className, sizeText = 14, sizeIcon = 16, left=false }: IPointsBlock) {
  return (
    <div className={`${styles.points} ${className}`}>
      <div className={styles.points} style={{ fontSize: `${sizeText}px`, order: `${left && 1}` }}>{formatNumber(points)}</div>
      <div className={styles.icon} style={{ backgroundImage: "url('assets/btnIcon.png')", width: `${sizeIcon}px`, height: `${sizeIcon}px`, order: `${left && 0}`  }}></div>
    </div>
  );
}
