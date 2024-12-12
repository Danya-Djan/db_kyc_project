import React from 'react';
import styles from './error.module.css';
import { useNavigate } from 'react-router-dom';

export function ErrorComponent() {
  const navigate = useNavigate();
  return (
    <div className={styles.errorContainer}>
      <p className={styles.error}>Ошибка загрузки данных. Попробуйте перезагрузить страницу или войти в приложение заново.</p>
      <div className={styles.errorBtnRow}>
        <div>
          <button onClick={() => window.location.reload()} className={`${styles.errorBtn} ${styles.btnReload}`}>Перезагрузить</button>
          <button onClick={() => navigate('/auth/welcome')} className={styles.errorBtn}>Войти заново</button>
        </div>
      </div>
    </div>
  );
}
