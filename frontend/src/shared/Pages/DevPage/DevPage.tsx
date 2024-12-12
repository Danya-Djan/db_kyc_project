import React, { useEffect, useState } from 'react';
import styles from './devpage.module.css';
import { ETextStyles } from '../../texts';
import { Button } from '../../Button';
import { useNavigate } from 'react-router-dom';


export function DevPage() {
  const [type, setType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const typeURL = currentUrl.searchParams.get("type");
    if (typeURL)
    setType(typeURL)
  }, []);


  const icons = ['assets/shopping.png', 'assets/compass.png', 'assets/friends.png'];
  const titles = ['Упаковываем товары!', 'Рейтинг игроков формируется', 'Рейтинг друзей формируется'];
  const texts = [
  'Собираем подборку самых желанных подарков для тебя! Копи баллы, чтобы выигрывать в аукционах!',
  'Рейтинг откроется, когда накопится достаточное количество пользователей.',  
  'Рейтинг откроется, когда накопится достаточное количество пользователей.'
  ]
  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div className={styles.iconContainer}>
          <div className={styles.icon} style={{ backgroundImage: `url(${type === 'auction' ? icons[0] : (type === 'rating' ? icons[1] : icons[2])})` }}></div>
        </div>
        <h1 style={ETextStyles.RwSb26100} className={styles.title}>{type === 'auction' ? titles[0] : (type === 'rating' ? titles[1] : titles[2])}</h1>
        <p className={styles.descr} style={ETextStyles.InRg16130}>{type === 'auction' ? texts[0] : (type === 'rating' ? texts[1] : texts[2])}</p>
        <Button text='Продолжить кликать' onClick={() => navigate('/')}/>
      </div>
    </div>
  );
}
