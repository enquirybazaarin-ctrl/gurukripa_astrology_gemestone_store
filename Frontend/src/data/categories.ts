export interface Category {
    _id: string;
    name: string;
    slug: string;
    image: string;
    banner?: string;
}

// Reusing consistent Unsplash images from products.ts
const CANDLE_JAR_IMG = 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80';
const VOTIVE_IMG = 'https://images.unsplash.com/photo-1602523961358-f9f03dd557db?auto=format&fit=crop&w=600&q=80';
const GIFT_IMG = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80';
const BELL_JAR_IMG = 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80';
const CYLINDER_IMG = 'https://images.unsplash.com/photo-1602523961358-f9f03dd557db?auto=format&fit=crop&w=600&q=80';

// User provided banner for "sbke liye banner" - Applied globally to categories
const FLIGHT_BANNER = 'https://rukminim2.flixcart.com/fk-p-flap/3240/540/image/1338bd4fc60390d8.jpg?q=60';

export const categories: Category[] = [
    {
        _id: '1',
        name: 'Candle Jars',
        slug: 'candle-jars',
        image: CANDLE_JAR_IMG,
        banner: FLIGHT_BANNER
    },
    {
        _id: '2',
        name: 'Votives',
        slug: 'votives',
        image: VOTIVE_IMG,
        banner: FLIGHT_BANNER
    },
    {
        _id: '3',
        name: 'Gift Hampers',
        slug: 'gift-hampers',
        image: GIFT_IMG,
        banner: FLIGHT_BANNER
    },
    {
        _id: '4',
        name: 'Bowls & Thali',
        slug: 'bowls-thali',
        image: CYLINDER_IMG,
        banner: FLIGHT_BANNER
    },
    {
        _id: '5',
        name: 'Bell Jars',
        slug: 'bell-jars',
        image: BELL_JAR_IMG,
        banner: FLIGHT_BANNER
    }
];
