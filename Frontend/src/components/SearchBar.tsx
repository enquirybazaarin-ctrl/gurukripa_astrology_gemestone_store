import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import { api } from '../services/api';

interface SearchSuggestion {
    _id: string;
    name: string;
    image: string;
    price: number;
    category: {
        name: string;
        slug: string;
    };
}

export const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.length < 2) {
                setSuggestions([]);
                setIsOpen(false);
                return;
            }

            setIsLoading(true);
            try {
                const response = await api.get(`/products/autocomplete?q=${encodeURIComponent(query)}`);
                setSuggestions(response.data.data.suggestions);
                setIsOpen(true);
            } catch (error) {
                console.error('Failed to fetch suggestions:', error);
                setSuggestions([]);
            } finally {
                setIsLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounceTimer);
    }, [query]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/products?q=${encodeURIComponent(query)}`);
            setIsOpen(false);
            setQuery('');
        }
    };

    const handleSuggestionClick = (productId: string) => {
        navigate(`/product/${productId}`);
        setIsOpen(false);
        setQuery('');
    };

    const clearSearch = () => {
        setQuery('');
        setSuggestions([]);
        setIsOpen(false);
    };

    return (
        <div ref={searchRef} className="relative w-full max-w-xl">
            <form onSubmit={handleSearch} className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for items, brands and more..."
                    className="w-full px-4 py-2.5 pl-10 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all bg-gray-50/50 placeholder:text-gray-400 text-sm font-medium"
                />
                <FiSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                {query && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                )}
            </form>

            {/* Autocomplete Dropdown */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                    {isLoading ? (
                        <div className="p-4 text-center text-gray-500">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent mx-auto"></div>
                        </div>
                    ) : suggestions.length > 0 ? (
                        <div className="py-2">
                            {suggestions.map((suggestion) => (
                                <button
                                    key={suggestion._id}
                                    onClick={() => handleSuggestionClick(suggestion._id)}
                                    className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-left transition-colors"
                                >
                                    <img
                                        src={suggestion.image}
                                        alt={suggestion.name}
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {suggestion.name}
                                        </p>
                                        <p className="text-xs text-gray-500">{suggestion.category.name}</p>
                                    </div>
                                    <p className="text-sm font-semibold text-text-gold">
                                        ₹{suggestion.price}
                                    </p>
                                </button>
                            ))}
                        </div>
                    ) : query.length >= 2 ? (
                        <div className="p-4 text-center text-gray-500">
                            No products found for "{query}"
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};
