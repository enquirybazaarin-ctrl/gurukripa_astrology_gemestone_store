import { Link } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';

interface BreadcrumbItem {
    label: string;
    link?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
    return (
        <nav className="flex items-center text-sm text-gray-500 mb-4 overflow-x-auto whitespace-nowrap scrollbar-hide py-1">
            <Link to="/" className="flex items-center hover:text-primary-600 transition-colors">
                <FiHome className="w-4 h-4" />
            </Link>

            {items.map((item, index) => (
                <div key={index} className="flex items-center">
                    <FiChevronRight className="w-4 h-4 mx-2 text-gray-400 flex-shrink-0" />
                    {item.link ? (
                        <Link
                            to={item.link}
                            className="hover:text-primary-600 transition-colors font-medium"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-gray-900 font-semibold truncate max-w-[200px] sm:max-w-xs">
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    );
};
