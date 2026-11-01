

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Zoom } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/zoom';
import './gallery.css';

interface ProductImageGalleryProps {
    images: string[];
}

export const ProductImageGallery = ({ images }: ProductImageGalleryProps) => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="bg-white touch-pan-y">
            {/* MOBILE: Swiper Slider */}
            <div className="md:hidden relative">
                <Swiper
                    modules={[Pagination, Zoom]}
                    pagination={{ clickable: true, dynamicBullets: true }}
                    zoom={true}
                    className="w-full h-[400px]"
                >
                    {images.map((img, index) => (
                        <SwiperSlide key={index}>
                            <div className="swiper-zoom-container w-full h-full flex items-center justify-center p-4">
                                <img
                                    src={img}
                                    alt={`Product view ${index + 1}`}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* DESKTOP: Thumbnail + Main Grid */}
            <div className="hidden md:flex gap-4 sticky top-24">
                {/* Thumbnails (Vertical List) */}
                <div className="w-20 flex-shrink-0 flex flex-col gap-2 max-h-[500px] overflow-y-auto hide-scrollbar">
                    {images.map((img, index) => (
                        <div
                            key={index}
                            className={`w-20 h-20 border rounded-sm cursor-pointer overflow-hidden transition-all ${activeIndex === index ? 'border-primary-600 ring-1 ring-primary-600 shadow-sm' : 'border-gray-200 hover:border-gray-400'
                                }`}
                            onMouseEnter={() => setActiveIndex(index)}
                        >
                            <img src={img} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>

                {/* Main Image */}
                <div className="flex-1 border border-gray-100 rounded-sm relative h-[500px] flex items-center justify-center p-4 group overflow-hidden bg-white">
                    <img
                        src={images[activeIndex]}
                        alt="Main view"
                        className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-125 origin-center cursor-zoom-in"
                    />
                </div>
            </div>
        </div>
    );
};

