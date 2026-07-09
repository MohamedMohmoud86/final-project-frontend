
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';


import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Link} from 'react-router-dom';

import { Pagination, Navigation, Autoplay } from 'swiper/modules';

function HeroSlider() {
  return (
    <>


<div className="hero">

    <div className='container'>
          <Swiper
          loop={true}
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }}
        pagination={{
          type: 'progressbar',
        }}
        navigation={true}
        modules={[Pagination, Navigation, Autoplay]}
        className="mySwiper"
      >
             <SwiperSlide>
                <div className='content'>
                <h4>Introducing the new</h4>
                <h3>Microsoft Xbox <br/>      360 Controller </h3>
                <p>Windwos xp/10/7/8 Ps3, Tv Box</p>
                <Link to="/" className='btn'>Shop Now</Link>

            </div>
            <img src="/img/banner_Hero1.jpg" alt='slider hero 1'/>
        </SwiperSlide>


         <SwiperSlide>
                <div className='content'>
                <h4>Introducing the new</h4>
                <h3>Microsoft Xbox <br/>      360 Controller </h3>
                <p>Windwos xp/10/7/8 Ps3, Tv Box</p>
                <Link to="/" className='btn'>Shop Now</Link>

            </div>
            <img src="/img/banner_Hero2.jpg" alt='slider hero 1'/>
        </SwiperSlide>


         <SwiperSlide>
                <div className='content'>
                <h4>Introducing the new</h4>
                <h3>Microsoft Xbox <br/>      360 Controller </h3>
                <p>Windwos xp/10/7/8 Ps3, Tv Box</p>
                <Link to="/" className='btn'>Shop Now</Link>

            </div>
            <img src="/img/banner_Hero3.jpg" alt='slider hero 1'/>
        </SwiperSlide>

      
      </Swiper>

    </div>
</div>





   
    </>
  )
}

export default HeroSlider