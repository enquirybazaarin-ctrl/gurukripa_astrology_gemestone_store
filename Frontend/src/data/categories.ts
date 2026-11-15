export interface Category {
    _id: string;
    name: string;
    slug: string;
    image: string;
    banner?: string;
}

const YELLOW_SAPPHIRE_IMG = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80';
const BLUE_SAPPHIRE_IMG = 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80';
const EMERALD_IMG = 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=600&q=80';
const RUBY_IMG = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80';
const PEARL_IMG = 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=600&q=80';

const GEM_BANNER = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1920&q=80';

export const categories: Category[] = [
    {
        _id: '1',
        name: 'Yellow Sapphire (Pukhraj)',
        slug: 'yellow-sapphire-pukhraj',
        image: YELLOW_SAPPHIRE_IMG,
        banner: GEM_BANNER
    },
    {
        _id: '2',
        name: 'Blue Sapphire (Neelam)',
        slug: 'blue-sapphire-neelam',
        image: BLUE_SAPPHIRE_IMG,
        banner: GEM_BANNER
    },
    {
        _id: '3',
        name: 'Emerald (Panna)',
        slug: 'emerald-panna',
        image: EMERALD_IMG,
        banner: GEM_BANNER
    },
    {
        _id: '4',
        name: 'Ruby (Manikya)',
        slug: 'ruby-manikya',
        image: RUBY_IMG,
        banner: GEM_BANNER
    },
    {
        _id: '5',
        name: 'Natural Pearl (Moti)',
        slug: 'pearl-moti',
        image: PEARL_IMG,
        banner: GEM_BANNER
    }
];
