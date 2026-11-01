import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

interface ImageGalleryProps {
    images: string[];
    productName: string;
    selectedImage?: string;
}

export const ImageGallery = ({ images, productName, selectedImage }: ImageGalleryProps) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    const mainSwiperRef = useRef<SwiperType | null>(null);
    const [showZoom, setShowZoom] = useState(false);

    // Sync external selectedImage with slider
    useEffect(() => {
        if (selectedImage && mainSwiperRef.current) {
            const index = images.findIndex(img => img === selectedImage);
            if (index !== -1 && index !== activeSlideIndex) {
                mainSwiperRef.current.slideTo(index);
                setActiveSlideIndex(index);
            }
        }
    }, [selectedImage, images]);

    return (
        <div className="flex flex-col lg:flex-row-reverse gap-4 relative">
            {/* Main Slider Area */}
            <div className="flex-1 w-full relative min-w-0">
                <div className="relative w-full aspect-square bg-white rounded-2xl lg:rounded-none overflow-hidden shadow-sm lg:shadow-none border border-gray-100 lg:border-none group">
                    <Swiper
                        modules={[Navigation, Pagination, Thumbs]}
                        onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
                        onSlideChange={(swiper) => setActiveSlideIndex(swiper.activeIndex)}
                        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                        navigation={{
                            prevEl: '.prev-btn',
                            nextEl: '.next-btn',
                        }}
                        pagination={{
                            clickable: true,
                            bulletActiveClass: 'bg-primary-600 !opacity-100 !w-4',
                            bulletClass: 'inline-block w-2 h-2 rounded-full bg-white/60 backdrop-blur-sm mx-1 cursor-pointer transition-all lg:hidden', // Hidden on desktop
                            el: '.custom-pagination'
                        }}
                        className="w-full h-full"
                    >
                        {images.map((img, idx) => (
                            <SwiperSlide key={idx} className="w-full h-full overflow-hidden">
                                <div className="w-full h-full flex items-center justify-center bg-white absolute inset-0">
                                    <img
                                        src={img}
                                        alt={`${productName} ${idx + 1}`}
                                        className="w-full h-full object-contain cursor-zoom-in"
                                        onClick={() => setShowZoom(true)}
                                    />
                                </div>
                            </SwiperSlide>
                        ))}

                        {/* Navigation Buttons (Desktop Only Show on Hover) */}
                        <button className="prev-btn absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity hidden lg:flex disabled:hidden border border-gray-100">
                            <FiChevronLeft size={20} />
                        </button>
                        <button className="next-btn absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity hidden lg:flex disabled:hidden border border-gray-100">
                            <FiChevronRight size={20} />
                        </button>

                        {/* Custom Pagination (Mobile & Tablet) */}
                        <div className="custom-pagination absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex lg:hidden"></div>
                    </Swiper>
                </div>
            </div>

            {/* Thumbnails Swiper (Desktop: Vertical Left, Mobile: Horizontal Bottom) */}
            {images.length > 1 && (
                <>
                    {/* Desktop Vertical Thumbnails */}
                    <div className="hidden lg:block w-[64px] flex-shrink-0 h-[450px] relative">
                        <Swiper
                            onSwiper={setThumbsSwiper}
                            modules={[Thumbs]}
                            direction="vertical"
                            spaceBetween={8}
                            slidesPerView="auto"
                            watchSlidesProgress={true}
                            className="absolute inset-0 w-full h-full thumbs-swiper"
                        >
                            {images.map((image, index) => (
                                <SwiperSlide
                                    key={index}
                                    className="!w-[64px] !h-[64px] cursor-pointer"
                                    onMouseEnter={() => {
                                        if (mainSwiperRef.current) {
                                            mainSwiperRef.current.slideTo(index);
                                        }
                                    }}
                                >
                                    <div
                                        className={`relative w-full h-full rounded-sm overflow-hidden border transition-all ${activeSlideIndex === index
                                            ? 'border-primary-600 ring-1 ring-primary-600'
                                            : 'border-gray-200 hover:border-primary-600'
                                            }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${productName} thumbnail ${index + 1}`}
                                            className="w-full h-full object-contain p-0.5"
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* Mobile Horizontal Thumbnails */}
                    <div className="lg:hidden relative w-full px-1 mt-4">
                        <Swiper
                            onSwiper={setThumbsSwiper}
                            modules={[Thumbs]}
                            spaceBetween={12}
                            slidesPerView={5}
                            watchSlidesProgress={true}
                            className="w-full thumbs-swiper"
                        >
                            {images.map((image, index) => (
                                <SwiperSlide key={index} className="!w-16 !h-16 cursor-pointer">
                                    <div
                                        className={`relative w-full aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeSlideIndex === index
                                            ? 'border-primary-600 ring-2 ring-primary-100 ring-offset-1'
                                            : 'border-transparent hover:border-gray-300'
                                            }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${productName} thumbnail ${index + 1}`}
                                            className={`w-full h-full object-cover transition-opacity ${activeSlideIndex === index ? 'opacity-100' : 'opacity-70'}`}
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </>
            )}

            {/* Zoom Modal (Portaled to document.body to escape stacking contexts) */}
            {showZoom && createPortal(
                <div
                    className="fixed inset-0 z-[9999] bg-white flex items-center justify-center p-4 animate-fadeIn"
                    onClick={() => setShowZoom(false)}
                >
                    <button
                        className="absolute top-4 right-4 text-gray-800 p-3 hover:bg-gray-100 rounded-full transition-colors z-[10000]"
                    >
                        <FiX size={24} />
                    </button>
                    <div className="w-full h-full flex items-center justify-center">
                        <img
                            src={images[activeSlideIndex]}
                            alt={productName}
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};
