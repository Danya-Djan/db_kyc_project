import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './modalwindow.module.css';
import { EIcons, Icon } from '../Icons';
import { Button } from '../Button';

interface IModalWindow {
  modalBlock : React.ReactNode,
  setClose(a: boolean): void,
  removeBtn ?: boolean,
  closeAnimOut?: boolean,
  setCloseAnimOut(a: boolean): void,
}

export function ModalWindow({ modalBlock, setClose, removeBtn, closeAnimOut, setCloseAnimOut }: IModalWindow) {
  const node = document.querySelector('#modal_root');
  const [closeAnim, setCloseAnim] = useState(false);
  const html = document.querySelector('html');

  useEffect(() => {
    if (html) {
      html.style.overflowY = 'hidden';
    }
  }, []);

  if (!node) return null;

  const closePopUp = () => {
    setCloseAnim(true);
    if (html) {
      html.style.overflowY = 'auto';
    }

    const timer = setTimeout(() => {
      setClose(true);
      clearTimeout(timer);
    }, 400);
  }

  useEffect(() => {
    if(closeAnimOut) {
      closePopUp();
      setCloseAnimOut(false);
    }
  }, [closeAnimOut])

  return ReactDOM.createPortal((
    <div className={`${styles.container} ${styles.animationOpen} ${closeAnim && styles.animationClose}`}>
      <div className={styles.modal}>
        <div className={styles.close} onClick={() => closePopUp()}></div>
        {modalBlock}
        {!removeBtn && <Button onClick={() => closePopUp()} text='Принято' />}
      </div>
    </div>
  ), node);
}

