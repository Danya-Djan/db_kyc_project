import React from 'react';
import styles from './styleelements.module.css';

interface IStyleElements {
  styleIndex: number
}

export function StyleElements({ styleIndex }: IStyleElements) {
  return (
    <div>
      <div className={`${styles.img} ${styles.img1}`} style={{ backgroundImage: `url("assets/style${styleIndex + 1}.png")`, width: `${styleIndex === 1 ? 73 : (styleIndex === 2 ? 48 : 82)}px`, height: `${styleIndex === 1 ? 68 : (styleIndex === 2 ? 86 : 127)}px`, top: `${styleIndex === 1 ? 2 : (styleIndex === 2 ? -5 : -20)}px`, right: `${styleIndex === 1 ? 10 : (styleIndex === 2 ? 20 : 10)}px`, transform: `rotate(${styleIndex === 1 ? 28 : (styleIndex === 2 ? 43 : 48)}deg)` }}></div>
      <div className={`${styles.img} ${styles.img2}`} style={{ backgroundImage: `url("assets/style${styleIndex + 1}.png")`, width: `${styleIndex === 1 ? 73 : (styleIndex === 2 ? 78 : 98)}px`, height: `${styleIndex === 1 ? 68 : (styleIndex === 2 ? 139 : 152)}px`, top: `${styleIndex === 1 ? 255 : (styleIndex === 2 ? 180 : 174)}px`, right: `${styleIndex === 1 ? 0 : (styleIndex === 2 ? 3 : -10)}px`, transform: `rotate(${styleIndex === 1 ? 32 : (styleIndex === 2 ? 19 : -114)}deg)`, zIndex: `${styleIndex > 1 ? 2 : 1}` }}></div>
      <div className={`${styles.img} ${styles.img3}`} style={{ backgroundImage: `url("assets/style${styleIndex + 1}.png")`, width: `${styleIndex === 1 ? 73 : (styleIndex === 2 ? 77 : 98)}px`, height: `${styleIndex === 1 ? 68 : (styleIndex === 2 ? 139 : 152)}px`, top: `${styleIndex === 1 ? 275 : (styleIndex === 2 ? 322 : 325)}px`, left: `${styleIndex === 1 ? -2 : (styleIndex === 2 ? -35 : -40)}px`, transform: `rotate(${styleIndex === 1 ? -36 : (styleIndex === 2 ? -24 : 65)}deg)` }}></div>
      <div className={`${styles.img} ${styles.img4}`} style={{ backgroundImage: `url("assets/style${styleIndex + 1}.png")`, width: `${styleIndex === 1 ? 73 : (styleIndex === 2 ? 77 : 98)}px`, height: `${styleIndex === 1 ? 68 : (styleIndex === 2 ? 139 : 152)}px`, top: `${styleIndex === 1 ? 530 : (styleIndex === 2 ? 433 : 425)}px`, right: `${styleIndex === 1 ? 55 : (styleIndex === 2 ? -5 : 0)}px`, transform: `rotate(${styleIndex === 1 ? 82 : (styleIndex === 2 ? 19 : 0)}deg)` }}></div>
    </div>
  );
}
