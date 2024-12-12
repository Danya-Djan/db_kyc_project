import React from 'react';
import styles from './button.module.css';
import { ETextStyles } from '../texts';

interface IButton {
  text: string | boolean | React.ReactNode,
  className ?: string,
  onClick?:() => void,
  icon?: React.ReactNode,
  disabled?: boolean,
  stroke?: boolean,
}

export function Button({ className, onClick, text, icon, disabled = false, stroke=false }: IButton) {
  
  return (
    <button disabled={disabled} onClick={onClick} className={`${styles.btn} ${className} ${disabled && styles.dis} ${stroke && styles.stroke}`} style={ETextStyles.InSb16120}>
      <div className={styles.content}>
        {icon && icon}
        {text}
      </div>
    </button>
  );
}
