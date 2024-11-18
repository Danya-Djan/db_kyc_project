import React, { useRef, memo, useEffect } from 'react';
import styles from './stylesswiper.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { generateRandomString } from '../../../utils/generateRandom';
import { EffectCoverflow } from 'swiper/modules';
import { useWindowSize } from 'usehooks-ts';

interface IStylesSwiper {
  selectedStyle: number,
  setCurrentSlide(a: number): void
}


export const StylesSwiper: React.FC<IStylesSwiper> = memo(({ selectedStyle, setCurrentSlide }: IStylesSwiper) => {
  const slideRefs = useRef<HTMLDivElement[]>([]);
  const swiperRef = useRef(null);
  const { width, height } = useWindowSize(); 

  const getSlideRect = (index: number) => {
    const slideRect = slideRefs.current[index]?.getBoundingClientRect();
    if (slideRect) {
      return slideRect.left;
    }
  };

  const handleSlideChange = () => {
    //@ts-ignore
    if (swiperRef.current && swiperRef.current.swiper) {
      //@ts-ignore
      const activeIndex = swiperRef.current.swiper.realIndex;
      setCurrentSlide(activeIndex)
    }
  };

  return (
    <Swiper
      ref={swiperRef}
      onSlideChange={handleSlideChange}
      modules={[EffectCoverflow]}
      spaceBetween={70}
      initialSlide={selectedStyle}
      grabCursor={true}
      slidesPerView={'auto'}
      centeredSlides={true}
      loop={true}
      effect={"coverflow"}
      coverflowEffect={{
        rotate: 0,
        stretch: 0,
        depth: 150,
        modifier: 2.5,
        slideShadows: false,
      }}
    >
      {[styles.card1, styles.card2, styles.card3, styles.card4].map((cardStyle, index) => (
        <SwiperSlide key={generateRandomString()} style={{width: 'fit-content'}}>
          {({ isActive }) => {
            let deg = 7;
            if (!isActive) {
              const left = getSlideRect(index);
              if (left) {
                if (left < width / 2) {
                  deg = -7
                }
              }
            };
            return (
              <div
                ref={(el) => (slideRefs.current[index] = el as HTMLDivElement)}
                className={`${styles.card} ${cardStyle} ${selectedStyle === index && styles.selected}`}
                style={{
                  transform: `rotate(${isActive ? 0 : deg}deg)`,
                  filter: `blur(${isActive ? 0 : 3}px)`
                }}
              ><div className={styles.img}></div></div>
            );
          }}
        </SwiperSlide>))}
    </Swiper>
  );
});
