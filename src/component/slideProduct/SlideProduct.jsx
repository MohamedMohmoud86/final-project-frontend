import React from 'react'
import Product from './Product'
import './slideProduct.css'

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation, Autoplay } from 'swiper/modules';




function SlideProduct({data , title}) {

    console.log(data);
  return (
    <div className='slide_products slide'>
        <div className='container'>
            <div className='top_slide'>
                <h2>{title}</h2>
               
            </div>


            <Swiper loop={true}
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }}  
            slidesPerView={4}
  spaceBetween={10}
  breakpoints={{
    0: {
      slidesPerView: 2,
    },
    480: {
      slidesPerView: 2.5,
    },
    768: {
      slidesPerView: 3,
    },
    1024: {
      slidesPerView: 4,
    },
  
}} navigation={true} modules={[Navigation,  Autoplay]} className="mySwiper">

                
               
 
                 {data.map((item) => {

                    return(
                        <SwiperSlide key={item.id}><Product item={item}/></SwiperSlide>
                    )
})} 
          
            
       
      </Swiper>


           

        </div>
    </div>
  )
}

export default SlideProduct