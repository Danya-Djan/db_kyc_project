import React from 'react';
import styles from './slider.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { generateRandomString } from '../../../utils/generateRandom';

import 'swiper/css';
import 'swiper/css/pagination';


interface ISlider {
  imgs: Array<string>,
  className?: string
}

export function Slider({ imgs, className }: ISlider) {
  return (
    <Swiper
      modules={[Pagination]}
      spaceBetween={0}
      slidesPerView={1}
      style={{ height: '100%' }}
      className={className}
      direction="horizontal"
      pagination={{ clickable: true }}
    >
      {imgs.map((item) => {
        return <SwiperSlide key={generateRandomString()}><div className={styles.img} style={{ backgroundImage: `url("${item}")` }}></div></SwiperSlide>
      })}
    </Swiper>
  );
}
