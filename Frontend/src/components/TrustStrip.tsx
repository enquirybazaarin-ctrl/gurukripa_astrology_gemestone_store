import React from 'react';
import { FiShield, FiTruck, FiClock, FiStar } from 'react-icons/fi';

export const TrustStrip: React.FC = () => {
    const items = [
        {
            icon: <FiShield className="w-5 h-5 md:w-6 md:h-6 text-accent" />,
            title: "Factory Direct",
            desc: "Unbeatable wholesale prices"
        },
        {
            icon: <FiClock className="w-5 h-5 md:w-6 md:h-6 text-accent" />,
            title: "Fast Turnaround",
            desc: "Quick production & delivery"
        },
        {
            icon: <FiStar className="w-5 h-5 md:w-6 md:h-6 text-accent" />,
            title: "Premium Quality",
            desc: "Expertly crafted products"
        },
        {
            icon: <FiTruck className="w-5 h-5 md:w-6 md:h-6 text-accent" />,
            title: "Global Shipping",
            desc: "Safe & reliable logistics"
        }
    ];

    return (
        <div className="bg-gray-50 border-y border-gray-100 py-6 md:py-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {items.map((item, index) => (
                        <div key={index} className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-3 md:gap-4">
                            <div className="flex-shrink-0 p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                                {item.icon}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm md:text-base">{item.title}</h4>
                                <p className="text-xs md:text-sm text-gray-500">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
