import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface GiftOccasion {
    id: string;
    label: string;
    designs: Array<{ id: string; image: string }>;
}

interface GiftCustomizationProps {
    occasions: GiftOccasion[];
    extraPrice: number;
    onCustomizationChange: (data: {
        occasion: string;
        designId: string;
        message: string;
        active: boolean;
        price: number;
    }) => void;
}

export const GiftCustomization: React.FC<GiftCustomizationProps> = ({
    occasions,
    extraPrice,
    onCustomizationChange,
}) => {
    const [isActive, setIsActive] = useState(false);
    const [selectedOccasion, setSelectedOccasion] = useState<GiftOccasion | null>(null);
    const [selectedDesignId, setSelectedDesignId] = useState<string>('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (occasions.length > 0 && !selectedOccasion) {
            setSelectedOccasion(occasions[0]);
        }
    }, [occasions, selectedOccasion]);

    useEffect(() => {
        onCustomizationChange({
            occasion: selectedOccasion?.label || '',
            designId: selectedDesignId,
            message,
            active: isActive,
            price: extraPrice,
        });
    }, [selectedOccasion, selectedDesignId, message, isActive, extraPrice, onCustomizationChange]);

    const handleOccasionSelect = (occasion: GiftOccasion) => {
        setSelectedOccasion(occasion);
        setSelectedDesignId(''); // Reset design when occasion changes
    };

    return (
        <div className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm mb-5">
            {/* Toggle Header */}
            <div
                className={`px-4 py-3.5 flex justify-between items-center cursor-pointer transition-all ${isActive ? 'bg-black text-white' : 'bg-white hover:bg-gray-50'}`}
                onClick={() => setIsActive(!isActive)}
            >
                <div>
                    <h3 className={`text-sm font-black uppercase tracking-widest ${isActive ? 'text-white' : 'text-gray-900'}`}>Make It Special</h3>
                    <p className={`text-[10px] font-bold uppercase tracking-tight ${isActive ? 'text-gray-400' : 'text-gray-500'}`}>Gift Personalization {extraPrice > 0 ? '+' : ''}₹{extraPrice}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${isActive ? 'border-white bg-white rotate-180' : 'border-gray-200'}`}>
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 4L6 8L10 4" stroke={isActive ? "#000" : "#999"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>

            <AnimatePresence>
                {isActive && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 py-5 space-y-5 bg-gray-50/50">
                            {/* 1. Occasion Selection */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Select Occasion</label>
                                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
                                    {occasions.map((occ) => (
                                        <button
                                            key={occ.id}
                                            onClick={() => handleOccasionSelect(occ)}
                                            className={`flex-shrink-0 px-4 py-1.5 rounded-md text-[11px] font-black uppercase transition-all duration-200 border-2 ${selectedOccasion?.id === occ.id
                                                ? 'bg-black text-white border-black shadow-sm'
                                                : 'bg-white text-gray-600 border-gray-100 hover:border-gray-300'
                                                }`}
                                        >
                                            {occ.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 2. Occasion-Based Image Display */}
                            {selectedOccasion && selectedOccasion.designs.length > 0 && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Choose Tag Design</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {selectedOccasion.designs.map((design) => (
                                            <div
                                                key={design.id}
                                                onClick={() => setSelectedDesignId(design.id)}
                                                className={`relative aspect-square rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-200 ${selectedDesignId === design.id
                                                    ? 'border-black shadow-md'
                                                    : 'border-transparent'
                                                    }`}
                                            >
                                                <img src={design.image} alt="Design" className="w-full h-full object-cover" />
                                                {selectedDesignId === design.id && (
                                                    <div className="absolute top-1 right-1 bg-black text-white p-0.5 rounded-full">
                                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                                                            <polyline points="20 6 9 17 4 12" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 3. Custom Message Area */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Personal Message</label>
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{message.length} / 200</span>
                                </div>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value.slice(0, 200))}
                                    placeholder="Write your personal message…"
                                    className="w-full h-24 px-3 py-2 bg-white border border-gray-200 rounded-lg text-[12px] text-gray-900 focus:outline-none focus:border-black transition-all resize-none shadow-sm font-medium"
                                />
                            </div>

                            {/* 5. Live Preview Box */}
                            <div className="space-y-2 pb-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center block">Handwritten Note Preview</label>
                                <div className="bg-white border border-gray-200 rounded-xl p-5 text-center min-h-[120px] flex flex-col items-center justify-center space-y-2 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-black/10" />
                                    <h4 className="font-bold text-sm text-gray-900 uppercase tracking-wider">{selectedOccasion?.label || 'Select Occasion'}</h4>
                                    <div className="w-8 h-px bg-gray-200" />
                                    <p className="text-gray-700 italic text-[14px] leading-relaxed max-w-[220px] whitespace-pre-wrap font-medium font-serif">
                                        {message || '“May your life be filled with light and love.”'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
