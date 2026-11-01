
import React from 'react';
import { FiCheckCircle, FiPackage, FiUsers, FiGlobe, FiAward, FiShield, FiTrendingUp } from 'react-icons/fi';
import { SEO } from '../components/SEO';

/* ─────────────────────────────────────────────
   ABOUT US PAGE — Premium Responsive Redesign
───────────────────────────────────────────── */
export const AboutUsPage = () => {
    return (
        <div className="bg-white min-h-screen font-['Outfit',sans-serif]">
            <SEO title="About Us" description="From a small workshop to India's Factory Floor. Learn more about Raja Home Decor and our premium manufacturing." />

            {/* ── HERO ── */}
            <section className="relative overflow-hidden bg-gray-950 text-white">
                {/* Subtle grid texture overlay */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
                        backgroundSize: '32px 32px',
                    }}
                />
                {/* Glow blobs */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 text-center max-w-4xl">
                    <span className="inline-block bg-white/10 border border-white/20 text-white/80 text-xs sm:text-sm font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
                        Our Story
                    </span>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
                        Crafting Elegance,<br className="hidden sm:block" /> Delivering Value.
                    </h1>
                    <p className="text-base sm:text-lg lg:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
                        Welcome to{' '}
                        <span className="text-white font-bold">Votive Candles</span> — India's premier
                        factory-direct manufacturer of premium glassware, candle holders, and home décor.
                        World-class quality. Unbeatable prices.
                    </p>
                    {/* Scroll cue */}
                    <div className="mt-12 flex justify-center">
                        <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
                    </div>
                </div>
            </section>

            {/* ── STATS STRIP ── */}
            <section className="bg-gray-50 border-y border-gray-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-center">
                        {stats.map((s) => (
                            <div key={s.label} className="space-y-1">
                                <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                                    {s.value}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500 font-medium uppercase tracking-wide">
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── OUR STORY ── */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
                    {/* Image */}
                    <div className="w-full lg:w-1/2">
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1590595906931-81f04f0ccebb?auto=format&fit=crop&w=900&q=80"
                                alt="Glass Manufacturing"
                                className="rounded-2xl shadow-2xl w-full object-cover aspect-[4/3] sm:aspect-video lg:aspect-[4/3]"
                            />
                            {/* Floating badge */}
                            <div className="absolute -bottom-5 -right-5 sm:-bottom-6 sm:-right-6 bg-gray-900 text-white rounded-2xl px-5 py-4 shadow-xl hidden sm:block">
                                <div className="text-2xl font-extrabold">30+</div>
                                <div className="text-xs text-gray-400 font-medium">Years of Craft</div>
                            </div>
                        </div>
                    </div>
                    {/* Text */}
                    <div className="w-full lg:w-1/2 space-y-6">
                        <span className="text-xs font-bold tracking-widest uppercase text-gray-400">
                            Who We Are
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-snug">
                            From a Small Workshop<br className="hidden sm:block" /> to India's Factory Floor
                        </h2>
                        <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                            Founded with a passion for craftsmanship, Votive Candles started as a small
                            manufacturing unit serving local markets. Over the last three decades, we have
                            grown into a fully integrated production house — supplying major retail chains,
                            hotels, and event planners across India.
                        </p>
                        <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                            We saw customers paying premium prices for standard quality due to unnecessary
                            middlemen. So we changed the game: our direct-to-consumer platform brings you
                            the same <strong className="text-gray-900">export-quality products</strong> directly
                            — at factory prices.
                        </p>
                        <div className="flex flex-wrap gap-3 pt-2">
                            {['ISO Certified', 'Export Ready', 'Pan-India Delivery'].map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full"
                                >
                                    <FiCheckCircle size={13} className="text-gray-500" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── WHY WE STAND OUT ── */}
            <section className="bg-gray-950 text-white py-16 sm:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 sm:mb-16">
                        <span className="text-xs font-bold tracking-widest uppercase text-gray-400">
                            Our Pillars
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold mt-2">Why We Stand Out</h2>
                        <p className="text-gray-400 mt-3 max-w-lg mx-auto text-sm sm:text-base">
                            The principles that have earned the trust of 10,000+ businesses across India.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((v) => (
                            <ValueCard key={v.title} {...v} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── MILESTONES / TIMELINE ── */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                <div className="text-center mb-12 sm:mb-16">
                    <span className="text-xs font-bold tracking-widest uppercase text-gray-400">
                        Our Journey
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
                        Three Decades of Growth
                    </h2>
                </div>
                <div className="relative max-w-2xl mx-auto">
                    {/* Vertical line */}
                    <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200 hidden sm:block" />
                    <div className="space-y-8 sm:space-y-10">
                        {milestones.map((m, i) => (
                            <div key={i} className="flex gap-5 sm:gap-8">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center z-10 shadow-md">
                                    {m.year.slice(-2)}'
                                </div>
                                <div className="bg-gray-50 rounded-xl px-5 py-4 flex-1 border border-gray-100">
                                    <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">
                                        {m.year}
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-sm sm:text-base">{m.title}</h4>
                                    <p className="text-gray-500 text-xs sm:text-sm mt-1 leading-relaxed">{m.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── VISION BANNER ── */}
            <section className="relative overflow-hidden bg-gray-900 text-white py-16 sm:py-24 px-4">
                <div className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                        backgroundSize: '24px 24px',
                    }}
                />
                <div className="relative container mx-auto max-w-3xl text-center">
                    <FiAward size={36} className="mx-auto mb-5 text-gray-300" />
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-5 leading-snug">
                        Our Vision
                    </h2>
                    <p className="text-base sm:text-xl text-gray-300 italic leading-relaxed">
                        "To become every Indian household's trusted partner for premium, affordable,
                        and sustainable home décor — made right here in India."
                    </p>
                    <div className="mt-8 flex justify-center gap-4 flex-wrap">
                        <TrustPill icon={FiShield} label="Quality Guaranteed" />
                        <TrustPill icon={FiTrendingUp} label="Continuously Improving" />
                        <TrustPill icon={FiUsers} label="10,000+ Happy Clients" />
                    </div>
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
    <div className="group p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all duration-300 cursor-default">
        <div className="w-12 h-12 bg-white/10 group-hover:bg-white/20 text-white rounded-xl flex items-center justify-center mb-5 transition-colors">
            <Icon size={22} />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
);

const TrustPill = ({ icon: Icon, label }: { icon: React.ElementType; label: string }) => (
    <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full">
        <Icon size={14} />
        {label}
    </span>
);

/* ─── Data ─── */

const stats = [
    { value: '30+', label: 'Years of Experience' },
    { value: '500+', label: 'Product Designs' },
    { value: '10k+', label: 'Happy Clients' },
    { value: '24h', label: 'Dispatch Ready' },
];

const values = [
    {
        icon: FiPackage,
        title: 'Factory Direct',
        desc: 'No middlemen, no hidden costs. You pay for the product, not the supply chain.',
    },
    {
        icon: FiCheckCircle,
        title: 'Quality Assured',
        desc: 'Every piece undergoes rigorous 3-level quality checks before packaging.',
    },
    {
        icon: FiUsers,
        title: 'Customer First',
        desc: 'From secure packaging to hassle-free replacements, your satisfaction is our priority.',
    },
    {
        icon: FiGlobe,
        title: 'Made in India',
        desc: 'Proudly manufacturing 100% of our products locally, supporting Indian craftsmanship.',
    },
];

const milestones = [
    {
        year: '1994',
        title: 'Humble Beginnings',
        desc: 'Started as a small glassware workshop in Mumbai, serving local candle makers.',
    },
    {
        year: '2003',
        title: 'First Export Order',
        desc: 'Secured our first international export order, validating our quality on a global stage.',
    },
    {
        year: '2012',
        title: 'Expanded Manufacturing',
        desc: 'Opened a state-of-the-art 50,000 sq. ft. production facility, tripling our capacity.',
    },
    {
        year: '2020',
        title: 'D2C Launch',
        desc: 'Launched Votive Candles direct-to-consumer platform, bringing factory prices to all.',
    },
    {
        year: '2024',
        title: '10,000+ Clients',
        desc: 'Crossed the 10,000 happy client milestone across retail, hospitality, and gifting.',
    },
];
