import React from 'react';
import styles from './layout.module.css';

interface ILayoutProps {
  children ?: React.ReactNode;
}

export function Layout({children}: ILayoutProps) {
  return (
    <div className={styles.layout}>
      <div style={{zIndex: '1', position: 'relative'}}>
        {children}
      </div>
      <div className='background' style={{height:`${window.innerHeight}px`}}></div>
    </div>
  );
}
