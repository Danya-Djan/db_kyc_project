import React, { useEffect, useRef, useState } from 'react';
import styles from './stylespage.module.css';
import { ETextStyles } from '../../texts';
import { Button } from '../../Button';
import { StylesSwiper } from '../../Elements/StylesSwiper';
import { Notification } from '../../Notification';


export function StylesPage() {
  const selectedIndex = Number(localStorage.getItem('selectedStyle'));
  const [selectedStyle, setSelectedStyle] = useState(selectedIndex ? selectedIndex : 0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotif, setShow] = useState(false);

  const stylesNames = ['Черно-синий', 'Grapefruit', 'Tropic mamba', 'Mamba & Grapefruit'];
  const colors = ['#7EB4DB', '#FE744B', '#F2D06B', '#EA9C55'];
  const gradients = ['linear-gradient(90deg, #90D7ED 13.05%, #6887C4 91.06%, #8085C0 172.24%)', 'linear-gradient(302deg, #FF5421 -59.57%, #FF7248 43.7%, #FF9576 163.26%)', 'linear-gradient(302deg, #6ACB54 -59.57%, #DCBB5A 43.7%, #E2883D 163.26%)', 'linear-gradient(302deg, #FF805A -1.15%, #DEAE53 83.89%)'];

  useEffect(() => {
    let selected = Number(localStorage.getItem('selectedStyle'));
    if (!selected) {
      localStorage.setItem('selectedStyle', '0');
    } else {
      setSelectedStyle(selected);
    }
    document.documentElement.style.setProperty('--primary', colors[selected]);
    document.documentElement.style.setProperty('--gradientPrimary', gradients[selected]);
  }, []);

  const selectStyle = () => {
    setSelectedStyle(currentSlide);
    localStorage.setItem('selectedStyle', currentSlide.toString());
    setShow(true);
    
    document.documentElement.style.setProperty('--primary', colors[currentSlide]);
    document.documentElement.style.setProperty('--gradientPrimary', gradients[currentSlide]);

    const back = document.querySelector('.background') as HTMLElement;
    if(back) {
      if (currentSlide === 0) {
        back.style.background = 'linear-gradient(180deg, #0D0D0D 0%, #222 100%) fixed';
      } else if (currentSlide === 1) {
        back.style.background = 'linear-gradient(164deg, #000 -0.67%, rgba(71, 71, 71, 0.70) 96.72%), #FF501C fixed';
      } else if(currentSlide === 2) {
        back.style.background = 'linear-gradient(164deg, #000 -6.52%, rgba(71, 71, 71, 0.70) 96.74%), #FFBF00 fixed';
      } else if(currentSlide === 3) {
        back.style.background = 'linear-gradient(163deg, #000 -34.89%, rgba(71, 71, 71, 0.70) 96.68%), #FF7A00 fixed';
      }
    }
  };

  return (
    <div>
      <h1 style={ETextStyles.RwSb26100} className={styles.title}>
        <span>Будь круче&nbsp;&mdash;</span> будь на&nbsp;стиле!</h1>
      <StylesSwiper selectedStyle={selectedStyle} setCurrentSlide={setCurrentSlide}/>
      <p style={ETextStyles.RwSb16120} className={styles.styleName}>{stylesNames[currentSlide]}</p>
      <Button onClick={selectStyle} disabled={currentSlide === selectedStyle} text={currentSlide === selectedStyle ? 'Уже выбран' : 'Выбрать этот стиль'} className={styles.btn}/>
      {showNotif && <Notification title={`Стиль ${stylesNames[selectedStyle]} выбран`} text='Можете вернуться на&nbsp;главную, чтобы увидеть изменения' setShow={setShow} />}
    </div>
  );
}