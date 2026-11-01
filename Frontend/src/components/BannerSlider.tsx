import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { Banner } from '../services/banner.service';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface BannerSliderProps {
  banners: Banner[];
}

export const BannerSlider = ({ banners }: BannerSliderProps) => {
  if (!banners || banners.length === 0) return null;

  return (
    <div className="mb-4">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={10}
        slidesPerView={1}
        grabCursor={true}
        navigation={true}
        loop={true}
        preventClicks={true}
        preventClicksPropagation={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        className="flipkart-banner-swiper group"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={banner._id}>
            <Link to={banner.link || '#'} draggable="false">
              <div className="w-full md:max-h-[400px] overflow-hidden flex items-center justify-center bg-gray-100">
                <picture className="w-full h-auto md:h-[400px] flex">
                  {banner.mobileImage && <source media="(max-width: 768px)" srcSet={banner.mobileImage} />}
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-auto md:h-[400px] block object-contain md:object-cover pointer-events-none"
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                  />
                </picture>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
