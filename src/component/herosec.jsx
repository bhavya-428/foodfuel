import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules"; 
import "swiper/css";
import chocolate from "../assets/chocolate.jpg";
import sundae from "../assets/sundae.jpg";
import waff from "../assets/waff sundae.jpg";
import waffle from "../assets/waffle.jpg";
import "swiper/css/navigation";               
import "./herosec.css";

function HeroSec() {
  return (
    <>
    <div className="herosec">
      <Swiper className="swiper"
        modules={[Navigation]}
        navigation={true}
        slidesPerView={1}
        loop={true}
      >
        <SwiperSlide>
          <img className="img4" src= {chocolate} alt="Healthy salad"/>
      
        </SwiperSlide>

        <SwiperSlide>
          <img className="img4" src= {sundae} alt="Home food"/>
        
        </SwiperSlide>

        <SwiperSlide>
          <img className="img4" src= {waff} alt="Healthy food background"/>
        </SwiperSlide>
         <SwiperSlide>
          <img className="img4" src= {waffle} alt="Healthy food background"/>
        </SwiperSlide>

      </Swiper>
   </div>
   </>
  );
}

export default HeroSec;