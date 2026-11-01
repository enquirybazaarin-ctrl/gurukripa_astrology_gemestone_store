import { useState, useRef, useEffect } from 'react';
import { FiCheckCircle, FiTruck, FiBox, FiAward, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const features = [
    {
        icon: FiAward,
        text: '100% Certified Natural',
    },
    {
        icon: FiCheckCircle,
        text: 'Vedic Puja Energized',
    },
    {
        icon: FiBox,
        text: 'Original Mine Sourced',
    },
    {
        icon: FiTruck,
        text: 'Insured Pan India Delivery',
    },
];

export const WhyChooseUs = () => {
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const checkScrollPosition = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
        }
    };

    useEffect(() => {
        checkScrollPosition();
        window.addEventListener('resize', checkScrollPosition);
        return () => window.removeEventListener('resize', checkScrollPosition);
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="bg-white py-8 border-t border-gray-100">
            <Link to="/about" className="container mx-auto px-4 relative block hover:opacity-95 transition-all group">
                <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-gray-900 group-hover:text-primary-600 transition-colors">Why Choose Us</h2>

                {/* Mobile Scroll Indicator - Left */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        scroll('left');
                    }}
                    className={`absolute bottom-6 left-4 z-10 text-gray-500 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm border border-gray-100 md:hidden transition-all duration-300 ${canScrollLeft ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'
                        }`}
                    aria-label="Scroll left"
                >
                    <FiChevronLeft size={16} />
                </button>

                {/* Mobile Scroll Indicator - Right */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        scroll('right');
                    }}
                    className={`absolute bottom-6 right-4 z-10 text-gray-500 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm border border-gray-100 md:hidden transition-all duration-300 ${canScrollRight ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'
                        }`}
                    aria-label="Scroll right"
                >
                    <FiChevronRight size={16} />
                </button>

                {/* Mobile: Horizontal Scroll, Desktop: Grid */}
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-4 gap-4 pb-10 md:pb-0"
                    style={{
                        touchAction: 'pan-x',
                        WebkitOverflowScrolling: 'touch',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                    onScroll={checkScrollPosition}
                >
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="min-w-[40%] md:min-w-0 snap-center flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-100 text-center group-hover:border-primary-200 group-hover:bg-primary-50/30 transition-all"
                        >
                            <feature.icon className="text-primary-600 text-2xl mb-2" />
                            <span className="text-sm font-medium text-gray-800">{feature.text}</span>
                        </div>
                    ))}
                </div>
            </Link>
        </div>
    );
};
