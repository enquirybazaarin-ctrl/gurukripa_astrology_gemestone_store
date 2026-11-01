import React from 'react';

export const ExperienceSection: React.FC = () => {
    return (
        <div className="py-12 md:py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="md:w-1/2">
                        <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                            Legacy of Excellence
                        </div>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                            Crafting Premium Decor with <span className="text-accent underline decoration-purple-200">10+ Years</span> of Expertise.
                        </h2>
                        <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed">
                            Since our inception, we have been the preferred choice for thousands of businesses, 
                            events, and weddings globally. Our commitment to factory-direct quality and 
                            unrivaled craftsmanship sets us apart.
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-3xl md:text-4xl font-black text-gray-900">10+</p>
                                <p className="text-sm md:text-base font-medium text-gray-500">Years of Experience</p>
                            </div>
                            <div>
                                <p className="text-3xl md:text-4xl font-black text-gray-900">5000+</p>
                                <p className="text-sm md:text-base font-medium text-gray-500">Global Clients Served</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="md:w-1/2 w-full">
                        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl group border border-gray-100">
                             <img 
                                src="https://res.cloudinary.com/dxcakk4vq/image/upload/v1774872362/Gemini_Generated_Image_kbr2m9kbr2m9kbr2_gvqskr.png" 
                                alt="Experience" 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                             />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
