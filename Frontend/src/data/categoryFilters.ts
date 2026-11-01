// ===================== CATEGORY FILTER CONFIGURATION =====================

// Category metadata - title and subtitle for each category
export const categoryMeta: Record<string, { title: string; subtitle: string }> = {
    'best-selling': {
        title: 'Best Selling Products',
        subtitle: 'Our most popular products loved by customers',
    },
    'candle-jars': {
        title: 'Candle Jars & Holders',
        subtitle: 'Factory-direct premium glass products at best prices',
    },
    'votives': {
        title: 'Votives & Small Candle Holders',
        subtitle: 'Factory-direct premium glass products at best prices',
    },
    'gift-hampers': {
        title: 'Gift Jars & Hampers',
        subtitle: 'Factory-direct premium glass products at best prices',
    },
    'bowls-thali': {
        title: 'Bowls, Thali & Stand Items',
        subtitle: 'Factory-direct premium glass products at best prices',
    },
    'bell-jars': {
        title: 'Bell Jars & Cake Covers',
        subtitle: 'Factory-direct premium glass products at best prices',
    },
};

// Filter types
export interface FilterOption {
    value: string;
    label: string;
}

export interface FilterConfig {
    id: string;
    name: string;
    options: FilterOption[];
}

// Common filters for all categories
export const commonFilters: FilterConfig[] = [
    {
        id: 'rating',
        name: 'Customer Rating',
        options: [
            { value: '4', label: '4★ & above' },
            { value: '3', label: '3★ & above' },
        ],
    },
];

// Category-specific filter definitions
const categorySpecificFilters: Record<string, FilterConfig[]> = {
    'candle-jars': [
        {
            id: 'capacity',
            name: 'Capacity (ml)',
            options: [
                { value: '100', label: '100 ml' },
                { value: '200', label: '200 ml' },
                { value: '250', label: '250 ml' },
                { value: '280', label: '280 ml' },
                { value: '300', label: '300 ml' },
                { value: '500', label: '500 ml' },
                { value: '700', label: '700 ml' },
            ],
        },
        {
            id: 'height',
            name: 'Height (inch)',
            options: [
                { value: '2.5', label: '2.5"' },
                { value: '3', label: '3"' },
                { value: '3.5', label: '3.5"' },
                { value: '4', label: '4"' },
                { value: '5', label: '5"' },
                { value: '6', label: '6"' },
            ],
        },
        {
            id: 'lid',
            name: 'Lid Type',
            options: [
                { value: 'with-lid', label: 'With Lid' },
                { value: 'without-lid', label: 'Without Lid' },
            ],
        },
        {
            id: 'finish',
            name: 'Finish',
            options: [
                { value: 'clear', label: 'Clear' },
                { value: 'matt', label: 'Matt' },
                { value: 'colour', label: 'Colour' },
                { value: 'silver', label: 'Silver' },
            ],
        },
        {
            id: 'shape',
            name: 'Shape',
            options: [
                { value: 'cylinder', label: 'Cylinder' },
                { value: 'square', label: 'Square' },
                { value: 'bowl', label: 'Bowl' },
            ],
        },
        {
            id: 'design',
            name: 'Design',
            options: [
                { value: 'dotted', label: 'Dotted' },
                { value: 'diamond', label: 'Diamond' },
                { value: 'line', label: 'Line' },
                { value: 'puzzle', label: 'Puzzle' },
                { value: 'crack', label: 'Crack' },
            ],
        },
    ],
    'votives': [
        {
            id: 'capacity',
            name: 'Capacity (ml)',
            options: [
                { value: '60', label: '60 ml' },
                { value: '80', label: '80 ml' },
                { value: '100', label: '100 ml' },
                { value: '150', label: '150 ml' },
                { value: '200', label: '200 ml' },
            ],
        },
        {
            id: 'size',
            name: 'Size (inch)',
            options: [
                { value: '2', label: '2"' },
                { value: '2.5', label: '2.5"' },
                { value: '3', label: '3"' },
            ],
        },
        {
            id: 'finish',
            name: 'Finish',
            options: [
                { value: 'clear', label: 'Clear' },
                { value: 'matt', label: 'Matt' },
                { value: 'colour', label: 'Colour' },
                { value: 'silver', label: 'Silver' },
            ],
        },
        {
            id: 'shape',
            name: 'Shape',
            options: [
                { value: 'round', label: 'Round' },
                { value: 'square', label: 'Square' },
            ],
        },
    ],
    'gift-hampers': [
        {
            id: 'setType',
            name: 'Set Type',
            options: [
                { value: 'single', label: 'Single' },
                { value: 'set-of-2', label: 'Set of 2' },
                { value: 'set-of-3', label: 'Set of 3' },
            ],
        },
        {
            id: 'lidDesign',
            name: 'Lid Design',
            options: [
                { value: 'bird', label: 'Bird' },
                { value: 'elephant', label: 'Elephant' },
                { value: 'lotus', label: 'Lotus' },
                { value: 'plain', label: 'Plain' },
            ],
        },
        {
            id: 'finish',
            name: 'Finish',
            options: [
                { value: 'gold', label: 'Gold' },
                { value: 'silver', label: 'Silver' },
                { value: 'colour', label: 'Colour' },
                { value: 'clear', label: 'Clear' },
            ],
        },
        {
            id: 'occasion',
            name: 'Occasion',
            options: [
                { value: 'wedding', label: 'Wedding' },
                { value: 'festive', label: 'Festive' },
                { value: 'corporate', label: 'Corporate Gift' },
            ],
        },
    ],
    'bowls-thali': [
        {
            id: 'diameter',
            name: 'Diameter (inch)',
            options: [
                { value: '5', label: '5"' },
                { value: '6', label: '6"' },
                { value: '7', label: '7"' },
                { value: '8', label: '8"' },
                { value: '10', label: '10"' },
            ],
        },
        {
            id: 'capacity',
            name: 'Capacity (ml)',
            options: [
                { value: '300', label: '300 ml' },
                { value: '500', label: '500 ml' },
                { value: '750', label: '750 ml' },
                { value: '1000', label: '1000 ml' },
            ],
        },
        {
            id: 'stand',
            name: 'With Stand',
            options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
            ],
        },
        {
            id: 'finish',
            name: 'Finish',
            options: [
                { value: 'clear', label: 'Clear' },
                { value: 'gold', label: 'Gold' },
                { value: 'silver', label: 'Silver' },
                { value: 'colour', label: 'Colour' },
            ],
        },
        {
            id: 'use',
            name: 'Use',
            options: [
                { value: 'decor', label: 'Decor' },
                { value: 'serving', label: 'Serving' },
            ],
        },
    ],
    'bell-jars': [
        {
            id: 'diameter',
            name: 'Diameter (inch)',
            options: [
                { value: '6', label: '6"' },
                { value: '8', label: '8"' },
                { value: '10', label: '10"' },
                { value: '12', label: '12"' },
            ],
        },
        {
            id: 'height',
            name: 'Height (inch)',
            options: [
                { value: '8', label: '8"' },
                { value: '10', label: '10"' },
                { value: '12', label: '12"' },
                { value: '14', label: '14"' },
            ],
        },
        {
            id: 'capacity',
            name: 'Capacity (ml)',
            options: [
                { value: '1000', label: '1000 ml' },
                { value: '1500', label: '1500 ml' },
                { value: '2000', label: '2000 ml' },
                { value: '3000', label: '3000 ml' },
            ],
        },
        {
            id: 'finish',
            name: 'Finish',
            options: [
                { value: 'clear', label: 'Clear' },
                { value: 'colour', label: 'Colour' },
            ],
        },
    ],
};

// Get filters for a specific category
export const getFiltersForCategory = (categorySlug: string): FilterConfig[] => {
    const specificFilters = categorySpecificFilters[categorySlug] || [];
    return [...commonFilters, ...specificFilters];
};

// Get all valid category slugs
export const validCategorySlugs = Object.keys(categoryMeta);

// Price range configuration
export const priceRangeConfig = {
    min: 0,
    max: 100000,
    step: 100,
};
