import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    FiFacebook, FiInstagram, FiTwitter, FiYoutube,
    FiMapPin, FiPhone, FiMail, FiPlus, FiMinus
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export const Footer = () => {
    const [openSection, setOpenSection] = useState<string | null>(null);

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    const footerSections = [
        {
            title: "Astrology Services",
            links: [
                { label: "Janam Kundli Analysis", to: "/#janam-kundli" },
                { label: "Kundli Milan & Marriage", to: "/#kundli-milan" },
                { label: "Career & Business Guidance", to: "/#career-business" },
                { label: "Vedic Gemstone Consultation", to: "/#gemstone-consultation" },
                { label: "Dosha Nivaran & Vedic Puja", to: "/#dosha-nivaran" }
            ]
        },
        {
            title: "Top Vedic Gemstones",
            links: [
                { label: "Yellow Sapphire (Pukhraj)", to: "/category/yellow-sapphire-pukhraj" },
                { label: "Blue Sapphire (Neelam)", to: "/category/blue-sapphire-neelam" },
                { label: "Emerald (Panna)", to: "/category/emerald-panna" },
                { label: "Ruby (Manikya)", to: "/category/ruby-manikya" },
                { label: "Red Coral (Moonga)", to: "/category/red-coral-moonga" }
            ]
        },
        {
            title: "Quick Links",
            links: [
                { label: "About Acharya Ji", to: "/about" },
                { label: "100% Lab Certification", to: "/about" },
                { label: "Free Kundli Recommendation", to: "/free-janampatri" },
                { label: "Original Siddh Rudraksha", to: "/category/rudraksha" }
            ]
        }
    ];

    return (
        <footer className="bg-[#141415] text-white border-t border-accent/10">
            {/* Desktop Footer (Hidden on Mobile) */}
            <div className="hidden lg:block pt-16 pb-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                        {/* Brand Column */}
                        <div className="lg:col-span-2 flex flex-col items-start pr-4">
                            <Link to="/" className="mb-4 inline-flex items-center gap-2.5 group">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 p-0.5 shadow-sm">
                                    <div className="w-full h-full bg-[#141415] rounded-[10px] flex items-center justify-center">
                                        <span className="text-xl">💎</span>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg font-black tracking-tight text-white uppercase">
                                        GURU KRIPA <span className="text-[#eb651e]">GEMS</span>
                                    </span>
                                    <span className="text-[9px] font-bold text-gray-400 tracking-wider uppercase">
                                        100% Certified Vedic Gemstones
                                    </span>
                                </div>
                            </Link>
                            <p className="text-gray-400 text-xs sm:text-sm mb-6 leading-relaxed max-w-sm">
                                Authentic Govt. & International Lab-Certified Natural Gemstones. Personally consecrated through Vedic Vedic Pujas by Acharya Ji with 25+ years of astrological expertise.
                            </p>
                            <div className="flex gap-3">
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#eb651e] hover:text-white transition-all">
                                    <FiInstagram className="w-4 h-4" />
                                </a>
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#eb651e] hover:text-white transition-all">
                                    <FiFacebook className="w-4 h-4" />
                                </a>
                                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#eb651e] hover:text-white transition-all">
                                    <FiYoutube className="w-4 h-4" />
                                </a>
                            </div>
                        </div>

                        {/* Desktop Links */}
                        {footerSections.map((section) => (
                            <div key={section.title}>
                                <h3 className="text-xs font-bold uppercase tracking-wider mb-5 text-gray-200">{section.title}</h3>
                                <ul className="space-y-3 text-xs text-gray-400 font-medium">
                                    {section.links.map((link) => (
                                        <li key={link.label}>
                                            <Link to={link.to} className="hover:text-white hover:text-[#eb651e] transition-colors block py-0.5">{link.label}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Contact Row */}
                    <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-6">
                            <a href="tel:+919323600011" className="flex items-center gap-2 hover:text-white">
                                <FiPhone className="text-[#eb651e]" />
                                <span>+91 93236 00011</span>
                            </a>
                            <a href="https://wa.me/919323600011" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white">
                                <FaWhatsapp className="text-green-500" />
                                <span>WhatsApp Consultation</span>
                            </a>
                        </div>
                        <p className="text-gray-500 text-xs">© 2024 Guru Kripa Astrology & GemsTone. All rights reserved.</p>
                    </div>
                </div>
            </div>

            {/* Mobile Footer (Accordion Style - Hidden on Desktop) */}
            <div className="lg:hidden pb-28">
                {/* 1. Contact Section (Top) */}
                <div className="pt-8 pb-6 px-4 border-b border-white/5 bg-[#1a1a1c]/20">
                    <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] mb-4 text-center text-gray-400">Consult Our Astrologer</h2>
                    <div className="grid grid-cols-3 gap-2">
                        <a
                            href="tel:+919323600011"
                            className="flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-2xl py-3 px-2 transition-all active:scale-[0.96] shadow-sm"
                        >
                            <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/30">
                                <FiPhone className="text-[#eb651e]" size={15} />
                            </div>
                            <span className="text-[10px] font-bold tracking-[0.05em] text-gray-200 uppercase">Call</span>
                        </a>
                        <a
                            href="https://wa.me/919323600011"
                            className="flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-2xl py-3 px-2 transition-all active:scale-[0.96] shadow-sm"
                        >
                            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/30">
                                <FaWhatsapp className="text-green-500" size={16} />
                            </div>
                            <span className="text-[10px] font-bold tracking-[0.05em] text-gray-200 uppercase">WhatsApp</span>
                        </a>
                        <a
                            href="mailto:contact@gurukripagems.com"
                            className="flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.08] rounded-2xl py-3 px-2 transition-all active:scale-[0.96] shadow-sm"
                        >
                            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                                <FiMail className="text-amber-500" size={15} />
                            </div>
                            <span className="text-[10px] font-bold tracking-[0.05em] text-gray-200 uppercase">Email</span>
                        </a>
                    </div>
                </div>

                {/* 2. Accordion Sections */}
                <div className="divide-y divide-white/5">
                    {footerSections.map((section) => (
                        <div key={section.title} className="w-full">
                            <button
                                onClick={() => toggleSection(section.title)}
                                className="w-full px-4 py-4 flex items-center justify-between group"
                            >
                                <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${openSection === section.title ? 'text-[#eb651e]' : 'text-gray-300'}`}>
                                    {section.title}
                                </span>
                                {openSection === section.title ? (
                                    <FiMinus className="text-[#eb651e]" size={16} />
                                ) : (
                                    <FiPlus className="text-gray-500" size={16} />
                                )}
                            </button>

                            <AnimatePresence>
                                {openSection === section.title && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                                        className="overflow-hidden bg-white/[0.02]"
                                    >
                                        <ul className="px-4 pb-4 pt-1 space-y-3">
                                            {section.links.map((link) => (
                                                <li key={link.label}>
                                                    <Link
                                                        to={link.to}
                                                        className="text-xs text-gray-400 font-medium hover:text-[#eb651e] transition-colors block w-full py-0.5"
                                                    >
                                                        {link.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                {/* Social & Legal (Bottom Mobile) */}
                <div className="px-4 py-6 bg-[#0a0a0b]/50">
                    <div className="flex justify-center gap-6 mb-4">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <FiInstagram className="text-gray-500 hover:text-white transition-colors" size={18} />
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <FiFacebook className="text-gray-500 hover:text-white transition-colors" size={18} />
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                            <FiYoutube className="text-gray-500 hover:text-white transition-colors" size={18} />
                        </a>
                    </div>
                    <p className="text-center text-[10px] text-gray-500 font-medium uppercase tracking-widest">
                        © 2024 Guru Kripa Astrology & GemsTone • 100% Certified Vedic Gemstones
                    </p>
                </div>
            </div>
        </footer>
    );
};

