import React from 'react';
import { FiCheckCircle, FiAward, FiShield, FiSun, FiHeart, FiPhoneCall } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export const AboutUsPage = () => {
    return (
        <div className="bg-white min-h-screen font-['Outfit',sans-serif]">
            <SEO 
                title="About Us - Guru Kripa Astrology & Gems Stone" 
                description="Over 25+ years of Vedic Astrology legacy. Discover 100% natural, unheated, certified gemstones energized through sacred Vedic Pran Pratishtha rituals by Acharya Ji." 
            />

            {/* ── HERO ── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#0c0c0e] via-[#1a120b] to-[#0c0c0e] text-white">
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(235,101,30,0.4) 1px, transparent 0)',
                        backgroundSize: '32px 32px',
                    }}
                />
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#eb651e]/15 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl" />

                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center max-w-4xl">
                    <span className="inline-block bg-[#eb651e]/20 border border-[#eb651e]/40 text-[#eb651e] text-xs sm:text-sm font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
                        Sacred Vedic Heritage
                    </span>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
                        Purity of Gems,<br className="hidden sm:block" /> Divine Grace of Guru.
                    </h1>
                    <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
                        Welcome to <span className="text-amber-400 font-bold">Guru Kripa Astrology & Gems Stone</span>. For over 25 years, our mission has been to provide seekers with 100% natural, unheated astrological gemstones energized with sacred Vedic mantras to harmonize planetary energies.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-4 justify-center">
                        <Link
                            to="/free-janampatri"
                            className="bg-gradient-to-r from-amber-500 via-[#eb651e] to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white font-bold px-6 py-3 rounded-full shadow-lg transition-all"
                        >
                            Get Free Kundli Analysis
                        </Link>
                        <a
                            href="tel:+919323600011"
                            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-3 rounded-full transition-all"
                        >
                            <FiPhoneCall className="text-amber-400" /> +91 93236 00011
                        </a>
                    </div>
                </div>
            </section>

            {/* ── STATS STRIP ── */}
            <section className="bg-amber-50/50 border-y border-amber-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-center">
                        {stats.map((s) => (
                            <div key={s.label} className="space-y-1">
                                <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                                    {s.value}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-600 font-medium uppercase tracking-wide">
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── STORY SECTION ── */}
            <section className="py-16 sm:py-24 container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <span className="text-xs font-bold text-[#eb651e] uppercase tracking-wider block mb-2">
                            The Guru Kripa Philosophy
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-snug mb-6">
                            Authentic Vedic Astrology Meets Lab-Certified Purity
                        </h2>
                        <div className="space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
                            <p>
                                In Vedic Jyotish, an astrological gemstone acts as an antenna that channels positive planetary rays (Kiran Pravaah) directly into your aura. However, synthetic, glass-filled, or heat-treated stones lose their astrological efficacy.
                            </p>
                            <p>
                                At <strong>Guru Kripa Astrology & Gems Stone</strong>, we guarantee that every Yellow Sapphire (Pukhraj), Blue Sapphire (Neelam), Emerald (Panna), Ruby (Manik), Pearl (Moti), and Coral (Moonga) is ethically mined, completely natural, and certified by premier gemological laboratories.
                            </p>
                            <p>
                                Before dispatch, each gemstone undergoes sacred <strong>Pran Pratishtha</strong> (Vedic consecration) during auspicious Muhurats, chanting 108 Vedic Beej Mantras in the seeker's name and Gotra.
                            </p>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-gray-900">
                            <img
                                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"
                                alt="Certified Natural Vedic Gemstone"
                                className="w-full h-[400px] object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl border border-amber-100 max-w-xs">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-amber-100 text-[#eb651e] flex items-center justify-center font-bold">
                                    🕉️
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">Pran Pratishtha Included</h4>
                                    <p className="text-xs text-gray-500">Consecrated during auspicious Muhurats</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CORE PILLARS ── */}
            <section className="bg-gray-950 text-white py-16 sm:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
                            Why Seekers Trust Us
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                            Our 4 Sacred Commitments
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((v) => (
                            <ValueCard key={v.title} {...v} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── MILESTONES ── */}
            <section className="py-16 sm:py-24 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <div className="text-center mb-16">
                    <span className="text-xs font-bold text-[#eb651e] uppercase tracking-widest block mb-2">
                        Our Journey
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                        25+ Years of Vedic Service
                    </h2>
                </div>

                <div className="relative border-l-2 border-amber-200 ml-4 sm:ml-32 space-y-12">
                    {milestones.map((m) => (
                        <div key={m.year} className="relative pl-8 sm:pl-10">
                            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#eb651e] border-4 border-white shadow-sm" />
                            <div className="sm:absolute sm:-left-28 sm:top-0 text-amber-700 font-extrabold text-lg sm:text-right sm:w-20">
                                {m.year}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{m.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{m.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

/* ─── Sub-components ─── */

const ValueCard = ({
    icon: Icon,
    title,
    desc,
}: {
    icon: React.ElementType;
    title: string;
    desc: string;
}) => (
    <div className="group p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all duration-300">
        <div className="w-12 h-12 bg-amber-500/10 group-hover:bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center mb-5 transition-colors">
            <Icon size={22} />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
);

/* ─── Data ─── */

const stats = [
    { value: '25+', label: 'Years of Vedic Jyotish' },
    { value: '50,000+', label: 'Blessed Seekers' },
    { value: '100%', label: 'Certified Natural Gems' },
    { value: '108', label: 'Mantra Pran Pratishtha' },
];

const values = [
    {
        icon: FiShield,
        title: '100% Natural & Untreated',
        desc: 'Zero glass filling, no synthetic enhancements. Mined from original sources like Ceylon, Burma & Zambia.',
    },
    {
        icon: FiSun,
        title: 'Vedic Consecration',
        desc: 'Energized with authentic Beej Mantras tailored to your birth chart and planetary Nakshatra.',
    },
    {
        icon: FiAward,
        title: 'Govt. Lab Certified',
        desc: 'Every gemstone arrives with an official gemological test report verifying origin, carat, and authenticity.',
    },
    {
        icon: FiHeart,
        title: 'Compassionate Guidance',
        desc: 'Direct consultation with Acharya Ji to guide you toward the exact gemstone suited for your Kundli.',
    },
];

const milestones = [
    {
        year: '1998',
        title: 'Sacred Beginnings',
        desc: 'Founded by Acharya Ji with a humble Jyotish consultation Kendra, dedicated to pure Vedic astrology.',
    },
    {
        year: '2008',
        title: 'Direct Sourcing from Ceylon & Burma',
        desc: 'Established ethical sourcing ties with Sri Lanka and Myanmar mine-owners to bypass middlemen.',
    },
    {
        year: '2016',
        title: 'Govt. Lab Testing Infrastructure',
        desc: 'Implemented 100% mandatory gemological laboratory certification for every dispatched gemstone.',
    },
    {
        year: '2022',
        title: 'Pan-India Divine Reach',
        desc: 'Crossed 50,000+ satisfied seekers across India, USA, UK, and UAE with custom Panchdhatu rings.',
    },
    {
        year: '2026',
        title: 'Guru Kripa Digital Platform',
        desc: 'Launched full online consultation, Free Janampatri report generation, and doorstep sacred delivery.',
    },
];
