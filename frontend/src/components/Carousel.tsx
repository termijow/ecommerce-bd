"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const images = [
  "/img/carrusel1.jpg",
  "/img/carrusel2.jpg",
  "/img/carrusel3.jpg",
];

export default function Carousel() {
  return (
    <div className="w-full h-[40vh] sm:h-[60vh] md:h-[75vh]">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop
        className="w-full h-full"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <img
              src={src}
              alt={`slide-${index}`}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
