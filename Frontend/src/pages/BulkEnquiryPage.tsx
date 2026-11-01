import { useState, useEffect } from 'react';
import { 
    FaWhatsapp, 
    FaIndustry, 
    FaBoxes, 
    FaCog, 
    FaTruck, 
    FaCheckCircle, 
    FaShieldAlt, 
    FaAward, 
    FaChevronDown, 
    FaArrowRight, 
    FaLayerGroup,
    FaStore,
    FaGift,
    FaGlassMartiniAlt,
    FaPlay,
    FaStar,
    FaLock,
    FaTimes,
    FaCertificate
} from 'react-icons/fa';
import { api } from '../services/api';
import { trackPixelEvent } from '../utils/metaPixel';
import { bannerService, Banner } from '../services/banner.service';
import { TrustStrip } from '../components/TrustStrip';
import { Stories } from '../components/home/Stories';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export const BulkEnquiryPage = () => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('Glass Candle Jars');
    const [selectedQuantity, setSelectedQuantity] = useState<string>('500–1,000');
    const [customization, setCustomization] = useState<string>('Not Sure');
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
    const [isExitModalOpen, setIsExitModalOpen] = useState<boolean>(false);

    const [formData, setFormData] = useState({
        name: '',
        company: '',
        phone: '',
        email: '',
        category: 'Glass Candle Jars',
        quantity: '500–1,000',
        customization: 'Not Sure',
        city: '',
        message: ''
    });

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await bannerService.getActiveBanners('bulk-enquiry');
                if (response.success && response.data?.banners) {
                    setBanners(response.data.banners);
                }
            } catch (err) {
                console.error("Failed to fetch banners:", err);
            }
        };
        fetchBanners();

        // Exit intent detection
        let exitTriggered = false;
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY < 10 && !exitTriggered) {
                exitTriggered = true;
                setIsExitModalOpen(true);
            }
        };
        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, []);

    const handleCategorySelect = (catName: string) => {
        setSelectedCategory(catName);
        setFormData(prev => ({ ...prev, category: catName }));
        document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleQuantitySelect = (qty: string) => {
        setSelectedQuantity(qty);
        setFormData(prev => ({ ...prev, quantity: qty }));
    };

    const handleCustomizationSelect = (cust: string) => {
        setCustomization(cust);
        setFormData(prev => ({ ...prev, customization: cust }));
    };

    const getWhatsAppUrl = (customText?: string) => {
        const text = customText || `Hello Acharya Ji, I would like to get a Free Gemstone & Kundli Recommendation for ${formData.name || 'me'}. Phone: ${formData.phone || ''}. Please guide me with authentic Vedic astrology solutions.`;
        return `https://wa.me/919323600011?text=${encodeURIComponent(text)}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const extraDetails = [];
            if (formData.customization) extraDetails.push(`Customization: ${formData.customization}`);
            if (formData.city) extraDetails.push(`City/Location: ${formData.city}`);
            if (formData.message) extraDetails.push(`Notes: ${formData.message}`);

            const fullMessage = extraDetails.join(' | ') || 'Bulk inquiry submitted from website.';

            const payload = {
                name: formData.name,
                company: formData.company,
                phone: formData.phone,
                email: formData.email,
                category: formData.category || selectedCategory,
                quantity: formData.quantity || selectedQuantity,
                message: fullMessage
            };

            await api.post('/bulk-enquiries', payload);
            trackPixelEvent('Lead', {
                content_name: 'Bulk Enquiry',
                category: payload.category,
                quantity: payload.quantity,
                currency: 'INR'
            });
            alert('Thank you! Our dedicated bulk sales team in Firozabad will contact you within 24 hours with pricing and availability.');
            
            setFormData({
                name: '',
                company: '',
                phone: '',
                email: '',
                category: selectedCategory,
                quantity: selectedQuantity,
                customization: 'Not Sure',
                city: '',
                message: ''
            });
        } catch (error) {
            console.error('Failed to submit enquiry', error);
            alert('Failed to submit enquiry. Please try submitting again or chat directly on WhatsApp.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Product Category Cards Data (Exactly 6 Categories as requested)
    const productCategories = [
        {
            id: 'candle-jars',
            name: 'Glass Candle Jars',
            desc: 'Heavy bottom, frosted, votive, & clear glass containers engineered for wax pouring.',
            image: '/banners/banner_candle.png',
            badge: 'MOST POPULAR',
            badgeGold: true
        },
        {
            id: 'vases',
            name: 'Decorative Glass Vases',
            desc: 'Designer, cylindrical & tapered glass vases for retailers, florists & decorators.',
            image: '/banners/banner_vase.png',
            badge: 'BULK STOCK',
            badgeGold: false
        },
        {
            id: 'planters',
            name: 'Glass Flower Pots',
            desc: 'Planters, hydroponic vessels & indoor decorative glass pots built for modern decor.',
            image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
            badge: 'TRENDING',
            badgeGold: false
        },
        {
            id: 'decorative',
            name: 'Decorative Glass Products',
            desc: 'Glass bowls, thalis, bell jars & accent home decor pieces crafted in Firozabad.',
            image: '/banners/banner_gift.png',
            badge: 'WHOLESALE',
            badgeGold: false
        },
        {
            id: 'candles',
            name: 'Ready-to-Ship Candles',
            desc: 'Scented candles, pillar candles & custom wax filled glass products for resale.',
            image: '/banners/banner3.png',
            badge: 'READY TO SHIP',
            badgeGold: true
        },
        {
            id: 'custom',
            name: 'Custom Requirements',
            desc: 'Custom glass molds, specialized color spraying, frosting, & logo branding.',
            image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80',
            badge: 'BESPOKE',
            badgeGold: false
        }
    ];

    // Buyer Segments Data (5 Industry Cards as requested)
    const buyerSegments = [
        {
            icon: FaGlassMartiniAlt,
            title: 'Candle Brands',
            text: 'Heat-resistant glass jars & containers engineered for wax pouring and safety.'
        },
        {
            icon: FaBoxes,
            title: 'Wholesalers & Distributors',
            text: 'Direct tier pricing and container-load quantities for regional distribution.'
        },
        {
            icon: FaStore,
            title: 'Home Décor Retailers',
            text: 'Designer vases, planters, and artifacts crafted for store inventory.'
        },
        {
            icon: FaGift,
            title: 'Gifting Businesses',
            text: 'Glass and candle hampers for corporate events, festive gifts, and returns.'
        },
        {
            icon: FaLayerGroup,
            title: 'Events & Decorators',
            text: 'Bulk decor vessels, centerpieces, and candle holders for weddings and events.'
        }
    ];

    // 5-Step Vertical Timeline Data
    const processSteps = [
        {
            step: '01',
            title: 'Manufacturing',
            desc: 'Raw glass melting and precision molding in high-capacity Firozabad furnaces operating at over 1400°C.',
            img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80'
        },
        {
            step: '02',
            title: 'Finishing',
            desc: 'Controlled annealing, rim polishing, frosted coating, color spraying, and surface refinement.',
            img: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80'
        },
        {
            step: '03',
            title: 'Quality Check',
            desc: 'Thermal shock testing, glass wall thickness verification, stress test, and flaw elimination.',
            img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
        },
        {
            step: '04',
            title: 'Packaging',
            desc: 'Heavy-duty 5-ply & 7-ply corrugated boxes with bubble cushioning for zero transit breakage.',
            img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80'
        },
        {
            step: '05',
            title: 'Dispatch',
            desc: 'Loaded into dedicated freight logistics trucks with GPS tracking straight to your warehouse across India.',
            img: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80'
        }
    ];

    // 8 FAQ Accordion Items
    const faqs = [
        {
            q: '1. What is your Minimum Order Quantity (MOQ)?',
            a: 'Our standard Minimum Order Quantity (MOQ) starts at 100 pieces for ready-stock glassware and 500 pieces for custom manufactured glass products or specialized color coatings.'
        },
        {
            q: '2. Can I get custom color spraying, frosting, or logo printing?',
            a: 'Yes! We specialize in custom glass finishes including matte frosting, glossy color spraying, metallic lustering, screen-printed logo branding, and private label box packaging.'
        },
        {
            q: '3. How long does it take to receive a bulk quote?',
            a: 'We send detailed wholesale quotations within 24 hours of form submission. For faster estimates, click the WhatsApp button to chat directly with our sales team.'
        },
        {
            q: '4. How do you handle pan-India shipping and breakage protection?',
            a: 'All consignments are packed in heavy-duty 5-ply or 7-ply corrugated boxes with internal cell dividers and bubble cushioning. We work with specialized fragile freight carriers to ensure safe nationwide delivery.'
        },
        {
            q: '5. Can I order product samples before placing a bulk order?',
            a: 'Yes, sample pieces can be dispatched for quality evaluation upon request. Sample costs are fully credited back toward your final bulk order invoice.'
        },
        {
            q: '6. What is the average manufacturing and delivery timeline?',
            a: 'Ready-stock items dispatch within 24-48 hours. Custom manufacturing orders typically require 7-12 business days depending on volume and finishing complexity.'
        },
        {
            q: '7. What information is required to get a precise quotation?',
            a: 'Please specify the product category, approximate quantity needed, delivery city/state, and whether you require custom frosting or branding.'
        },
        {
            q: '8. Do you manufacture custom glass shapes or molds?',
            a: 'Yes! For enterprise buyers, our Firozabad unit designs bespoke glass molds tailored to your specific dimensional and aesthetic requirements.'
        }
    ];

    return (
        <div className="min-h-screen bg-[#F8F6F3] text-slate-800 font-sans selection:bg-amber-100 selection:text-amber-900 pb-28 md:pb-12">
            
            {/* LIVE VISITOR COUNTER BAR */}
            <div className="bg-[#EBF3FA] border-b border-[#D0E2F3] py-2 px-4 text-xs sm:text-sm text-[#1A3C5E] font-semibold text-center flex items-center justify-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span><strong>18 Seekers & Devotees</strong> are currently consulting for Vedic Gemstones & Kundli Analysis.</span>
            </div>

            {/* MINIMALIST BRAND HEADER (Dedicated for /bulk-enquiry) */}
            <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 max-w-7xl h-16 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2 group">
                        <img 
                            src="/banners/Logo/logo2.png" 
                            alt="Guru Kripa Astrology & GemsTone" 
                            className="h-10 sm:h-12 w-auto object-contain" 
                        />
                    </a>

                    <div className="flex items-center gap-4">
                        <a
                            href="/"
                            className="text-xs text-slate-600 hover:text-[#1A3C5E] transition-colors font-semibold hidden sm:inline-block"
                        >
                            ← Back to Home
                        </a>
                        <a
                            href={getWhatsAppUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-[#25D366] hover:bg-[#1DA851] text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                        >
                            <FaWhatsapp className="text-sm" />
                            <span>WhatsApp Astrologer</span>
                        </a>
                    </div>
                </div>
            </header>

            {/* SECTION 1 — HERO BANNER */}
            <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 border-b border-slate-200/80 overflow-hidden bg-gradient-to-b from-[#EBF3FA]/70 via-white to-[#F8F6F3]">
                {/* Background Ambient Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-200/20 blur-[120px] pointer-events-none rounded-full" />
                
                <div className="container mx-auto px-4 max-w-7xl relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        
                        {/* LEFT COLUMN: HERO COPY & CTAs */}
                        <div className="lg:col-span-7 space-y-6 text-left">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E6EEF7] border border-[#C5D8EB] text-[#1A3C5E] text-xs font-extrabold uppercase tracking-wider shadow-sm">
                                <FaIndustry className="text-[#C8952B] text-xs" />
                                DIRECT MANUFACTURER • FIROZABAD, UP
                            </div>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight leading-[1.12] text-[#10263E]">
                                Premium Glass & Candle Manufacturing | <span className="text-[#C8952B]">Factory Direct Wholesale Prices</span>
                            </h1>

                            <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-2xl font-normal">
                                Source high-quality glass containers and finished candles directly from Firozabad's leading manufacturer. Get customized bulk quotes within 24 hours.
                            </p>

                            {/* Dual CTAs */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                                <button
                                    onClick={() => document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="px-8 py-4 bg-[#C8952B] hover:bg-[#b08120] text-white rounded-xl font-bold text-base transition-all duration-200 shadow-lg shadow-amber-600/25 flex items-center justify-center gap-2 group"
                                >
                                    <span>Get Bulk Quote</span>
                                    <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                                </button>

                                <a
                                    href={getWhatsAppUrl()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-4 bg-[#25D366] hover:bg-[#1DA851] text-white rounded-xl font-bold text-base transition-all duration-200 shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-3.5"
                                >
                                    <FaWhatsapp className="text-xl" />
                                    <span>WhatsApp Us</span>
                                </a>
                            </div>

                            {/* Trust Highlights Strip (4 Badges requested) */}
                            <div className="pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold text-[#1A3C5E]">
                                <div className="flex items-center gap-2">
                                    <FaCheckCircle className="text-[#C8952B] shrink-0 text-sm" />
                                    <span>25+ Years Excellence</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaCheckCircle className="text-[#C8952B] shrink-0 text-sm" />
                                    <span>10,000+ B2B Clients</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaCheckCircle className="text-[#C8952B] shrink-0 text-sm" />
                                    <span>Pan-India Supply</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaCheckCircle className="text-[#C8952B] shrink-0 text-sm" />
                                    <span>Custom Manufacturing</span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: HERO VISUAL GRID / SLIDER */}
                        <div className="lg:col-span-5 relative">
                            {banners.length > 0 ? (
                                <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-2xl bg-white p-2">
                                    <Swiper
                                        modules={[Autoplay, Pagination, Navigation]}
                                        spaceBetween={0}
                                        slidesPerView={1}
                                        loop={true}
                                        autoplay={{ delay: 4500, disableOnInteraction: false }}
                                        pagination={{ clickable: true }}
                                        className="w-full flipkart-banner-swiper rounded-2xl overflow-hidden"
                                    >
                                        {banners.map((banner) => (
                                            <SwiperSlide key={banner._id}>
                                                <div className="relative aspect-[4/3] w-full bg-slate-100">
                                                    <img
                                                        src={banner.image}
                                                        alt={banner.title || "Bulk Glassware"}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            ) : (
                                <div className="relative">
                                    <div className="rounded-3xl overflow-hidden border border-slate-200 bg-white p-3 shadow-2xl group">
                                        <img
                                            src="/banners/banner_candle.png"
                                            alt="Glass Candle Jars Manufacturing"
                                            className="w-full h-[380px] object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>

                                    {/* Floating Manufacturer Seal Badge */}
                                    <div className="absolute -bottom-5 -left-5 bg-white border-2 border-[#C8952B] text-slate-900 p-4 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md hidden sm:flex">
                                        <div className="w-11 h-11 rounded-xl bg-[#FFF8E7] text-[#C8952B] flex items-center justify-center shrink-0 font-bold text-xl">
                                            <FaAward />
                                        </div>
                                        <div className="text-left pr-2">
                                            <div className="text-xs font-extrabold uppercase tracking-wider text-[#1A3C5E]">Aqsha Glass Unit</div>
                                            <div className="text-xs text-slate-500 font-medium">Direct Manufacturing Infrastructure</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </section>

            {/* TRUST STRIP COMPONENT */}
            <div className="bg-white border-b border-slate-200">
                <TrustStrip />
            </div>

            {/* SECTION 2 — PRODUCT CATEGORIES GRID */}
            <section className="py-16 md:py-24 border-b border-slate-200/60" id="categories">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center mb-12">
                        <span className="text-[#C8952B] text-xs font-bold uppercase tracking-widest">Wholesale Product Range</span>
                        <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#10263E] mt-2 mb-3 tracking-tight">
                            Choose Your Product Category
                        </h2>
                        <p className="text-slate-600 text-sm md:text-base max-w-xl mx-auto font-medium">
                            Click any category to pre-select in the bulk enquiry form below for instant catalog request.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {productCategories.map((cat) => {
                            const isSelected = selectedCategory === cat.name;
                            return (
                                <div
                                    key={cat.id}
                                    onClick={() => handleCategorySelect(cat.name)}
                                    className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between relative bg-white shadow-md ${
                                        isSelected 
                                            ? 'border-[#C8952B] ring-2 ring-[#C8952B]/30 shadow-2xl bg-amber-50/20' 
                                            : 'border-slate-200 hover:border-[#C8952B] hover:shadow-xl hover:-translate-y-1.5'
                                    }`}
                                >
                                    {/* Category Image */}
                                    <div className="aspect-[16/10] w-full overflow-hidden relative bg-slate-100">
                                        <img
                                            src={cat.image}
                                            alt={cat.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm text-white ${cat.badgeGold ? 'bg-[#C8952B]' : 'bg-[#1A3C5E]'}`}>
                                            {cat.badge}
                                        </div>

                                        {isSelected && (
                                            <div className="absolute top-3 right-3 bg-[#C8952B] text-white w-7 h-7 rounded-full flex items-center justify-center shadow-lg font-bold text-xs">
                                                ✓
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 text-left flex-1 flex flex-col justify-between space-y-3">
                                        <div>
                                            <h3 className={`text-xl font-bold transition-colors ${isSelected ? 'text-[#C8952B]' : 'text-[#1A3C5E] group-hover:text-[#C8952B]'}`}>
                                                {cat.name}
                                            </h3>
                                            <p className="text-slate-600 text-xs mt-2 leading-relaxed font-medium">
                                                {cat.desc}
                                            </p>
                                        </div>

                                        <div className="pt-4 flex items-center justify-between text-xs font-bold border-t border-slate-100">
                                            <span className={isSelected ? 'text-[#C8952B]' : 'text-[#C8952B] group-hover:text-[#b08120]'}>
                                                {isSelected ? 'Selected Category' : 'Select for Quote'}
                                            </span>
                                            <FaArrowRight className={`text-xs transition-transform ${isSelected ? 'text-[#C8952B] translate-x-1' : 'text-[#C8952B] group-hover:translate-x-1'}`} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* SECTION 3 — INDUSTRY SOLUTIONS */}
            <section className="py-16 md:py-24 border-b border-slate-200/60 bg-white">
                <div className="container mx-auto px-4 max-w-7xl text-center">
                    <span className="text-[#C8952B] text-xs font-bold uppercase tracking-widest">Targeted Business Solutions</span>
                    <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#10263E] mt-2 mb-4 tracking-tight">
                        Built for Businesses Buying in Bulk
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto mb-12 font-medium">
                        Tailored glass container and manufacturing support designed for key commercial sectors across India.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 text-left mb-12">
                        {buyerSegments.map((seg, idx) => {
                            const IconComponent = seg.icon;
                            return (
                                <div key={idx} className="p-6 rounded-2xl bg-[#F8F6F3] border border-slate-200/80 hover:border-[#1A3C5E] hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                                    <div>
                                        <div className="w-12 h-12 rounded-xl bg-[#EBF3FA] text-[#1A3C5E] flex items-center justify-center mb-5 group-hover:bg-[#1A3C5E] group-hover:text-white transition-colors">
                                            <IconComponent className="text-xl" />
                                        </div>
                                        <h3 className="text-base font-bold text-[#1A3C5E] mb-2">{seg.title}</h3>
                                        <p className="text-slate-600 text-xs leading-relaxed font-medium">{seg.text}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* HORIZONTAL TRUST BAR */}
                    <div className="bg-[#1A3C5E] text-white rounded-2xl p-6 md:p-8 flex flex-wrap items-center justify-between gap-4 shadow-xl">
                        <div className="flex items-center gap-2.5 font-bold text-sm">
                            <FaShieldAlt className="text-[#C8952B] text-lg" />
                            <span>Quality Manufacturing</span>
                        </div>
                        <div className="flex items-center gap-2.5 font-bold text-sm">
                            <FaBoxes className="text-[#C8952B] text-lg" />
                            <span>Bulk Capacity</span>
                        </div>
                        <div className="flex items-center gap-2.5 font-bold text-sm">
                            <FaCog className="text-[#C8952B] text-lg" />
                            <span>Custom Options</span>
                        </div>
                        <div className="flex items-center gap-2.5 font-bold text-sm">
                            <FaCheckCircle className="text-[#C8952B] text-lg" />
                            <span>100% Quality Check</span>
                        </div>
                        <div className="flex items-center gap-2.5 font-bold text-sm">
                            <FaTruck className="text-[#C8952B] text-lg" />
                            <span>Pan-India Supply</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4 — MANUFACTURING PROCESS TIMELINE */}
            <section className="py-16 md:py-24 border-b border-slate-200/60 bg-[#F8F6F3]">
                <div className="container mx-auto px-4 max-w-7xl text-center">
                    <span className="text-[#C8952B] text-xs font-bold uppercase tracking-widest font-mono">Transparency in Motion</span>
                    <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#10263E] mt-2 mb-3 tracking-tight">
                        Our Manufacturing Process
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto mb-12 font-medium">
                        Watch how every product is crafted with precision, quality, and care in our Firozabad unit — before it reaches you.
                    </p>

                    {/* Real Factory Stories Video Carousel Component */}
                    <div className="mb-14 rounded-3xl border border-slate-200 overflow-hidden bg-white p-2 sm:p-4 shadow-xl">
                        <Stories hideHeader={true} />
                    </div>

                    {/* 5-Step Vertical Timeline Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-left mb-12">
                        {processSteps.map((proc, idx) => (
                            <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between relative group overflow-hidden shadow-md">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-3xl font-black text-[#1A3C5E] font-serif">{proc.step}</span>
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#C8952B]"></div>
                                    </div>

                                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 my-3">
                                        <img
                                            src={proc.img}
                                            alt={proc.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>

                                    <h3 className="text-lg font-bold text-[#1A3C5E]">{proc.title}</h3>
                                    <p className="text-slate-600 text-xs leading-relaxed font-medium">{proc.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* VIDEO SHOWCASE BOX */}
                    <div 
                        onClick={() => setIsVideoModalOpen(true)}
                        className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden border-2 border-[#C8952B] shadow-2xl h-80 sm:h-96 cursor-pointer group"
                    >
                        <img 
                            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80" 
                            alt="Factory Floor Video" 
                            className="w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center p-6">
                            <div className="w-20 h-20 rounded-full bg-[#C8952B] flex items-center justify-center text-white text-2xl mb-4 shadow-2xl group-hover:scale-110 transition-transform">
                                <FaPlay className="ml-1" />
                            </div>
                            <h3 className="text-2xl font-bold font-serif mb-2">Watch Real Factory Production Reel</h3>
                            <p className="text-sm opacity-90 font-medium">See our Firozabad furnace unit, molding line, and quality testing live in action.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 5 — LEAD GENERATION FORM */}
            <section className="py-16 md:py-24 border-b border-slate-200/60 bg-gradient-to-br from-[#10263E] via-[#1A3C5E] to-[#10263E] text-white scroll-mt-12" id="enquiry-form">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center mb-12">
                        <span className="text-[#C8952B] text-xs font-bold uppercase tracking-widest">Direct Manufacturer Quotes</span>
                        <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-white mt-2 mb-3 tracking-tight">
                            Get Custom Bulk Pricing
                        </h2>
                        <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto font-normal">
                            Fill in your specifications below. Our sales office in Firozabad will send your wholesale quote within 24 hours.
                        </p>
                    </div>

                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                        
                        {/* MAIN FORM CARD */}
                        <div className="lg:col-span-8">
                            <div className="p-6 sm:p-10 rounded-3xl bg-white text-slate-800 shadow-2xl text-left">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    
                                    {/* Name & Company */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#1A3C5E] uppercase tracking-wider">
                                                Full Name *
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="e.g. Rahul Sharma"
                                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1A3C5E] focus:bg-white focus:ring-2 focus:ring-[#1A3C5E]/20 transition-all text-sm font-medium"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#1A3C5E] uppercase tracking-wider">
                                                Business / Company Name
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Apex Decor Pvt Ltd"
                                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1A3C5E] focus:bg-white focus:ring-2 focus:ring-[#1A3C5E]/20 transition-all text-sm font-medium"
                                                value={formData.company}
                                                onChange={e => setFormData({ ...formData, company: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Phone & Email */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#1A3C5E] uppercase tracking-wider">
                                                WhatsApp / Phone Number *
                                            </label>
                                            <input
                                                required
                                                type="tel"
                                                placeholder="e.g. +91 98765 43210"
                                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1A3C5E] focus:bg-white focus:ring-2 focus:ring-[#1A3C5E]/20 transition-all text-sm font-medium"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#1A3C5E] uppercase tracking-wider">
                                                Email Address *
                                            </label>
                                            <input
                                                required
                                                type="email"
                                                placeholder="e.g. rahul@company.com"
                                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1A3C5E] focus:bg-white focus:ring-2 focus:ring-[#1A3C5E]/20 transition-all text-sm font-medium"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Product Category Dropdown */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#1A3C5E] uppercase tracking-wider">
                                            Product Required *
                                        </label>
                                        <select
                                            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#1A3C5E] focus:bg-white focus:ring-2 focus:ring-[#1A3C5E]/20 transition-all text-sm font-medium"
                                            value={formData.category}
                                            onChange={e => {
                                                setFormData({ ...formData, category: e.target.value });
                                                setSelectedCategory(e.target.value);
                                            }}
                                        >
                                            <option value="Glass Candle Jars">Glass Candle Jars</option>
                                            <option value="Decorative Glass Vases">Decorative Glass Vases</option>
                                            <option value="Glass Flower Pots">Glass Flower Pots / Planters</option>
                                            <option value="Decorative Glass Products">Decorative Glass Products</option>
                                            <option value="Ready-to-Ship Candles">Ready-to-Ship Candles</option>
                                            <option value="Custom Requirements">Custom Requirements (Bespoke Molds)</option>
                                        </select>
                                    </div>

                                    {/* Quantity Chips */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#1A3C5E] uppercase tracking-wider">
                                            Approximate Quantity Required *
                                        </label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                            {['100–500', '500–1,000', '1,000–5,000', '5,000–10,000', '10,000+'].map((qty) => (
                                                <button
                                                    type="button"
                                                    key={qty}
                                                    onClick={() => handleQuantitySelect(qty)}
                                                    className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 text-center ${
                                                        selectedQuantity === qty
                                                            ? 'bg-[#1A3C5E] border-[#1A3C5E] text-white shadow-md'
                                                            : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-blue-50'
                                                    }`}
                                                >
                                                    {qty} pcs
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Customization & City */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#1A3C5E] uppercase tracking-wider">
                                                Customization Required?
                                            </label>
                                            <div className="flex gap-2">
                                                {['Yes', 'No', 'Not Sure'].map((opt) => (
                                                    <button
                                                        type="button"
                                                        key={opt}
                                                        onClick={() => handleCustomizationSelect(opt)}
                                                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                                                            customization === opt
                                                                ? 'bg-[#C8952B] border-[#C8952B] text-white shadow-md'
                                                                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                                                        }`}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#1A3C5E] uppercase tracking-wider">
                                                City / Delivery Location
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Mumbai, Maharashtra"
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1A3C5E] focus:bg-white focus:ring-2 focus:ring-[#1A3C5E]/20 transition-all text-sm font-medium"
                                                value={formData.city}
                                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Additional Requirements */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#1A3C5E] uppercase tracking-wider">
                                            Additional Details / Specifications
                                        </label>
                                        <textarea
                                            rows={3}
                                            placeholder="Tell us about specific sizes, colors, timeline, or logo printing..."
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1A3C5E] focus:bg-white focus:ring-2 focus:ring-[#1A3C5E]/20 transition-all text-sm font-medium"
                                            value={formData.message}
                                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        ></textarea>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-[#C8952B] hover:bg-[#b08120] text-white font-extrabold py-4 rounded-xl text-base transition-all duration-200 shadow-xl shadow-amber-600/30 flex items-center justify-center gap-2 group disabled:opacity-50"
                                    >
                                        <span>{isSubmitting ? 'Submitting Request...' : 'Get Bulk Pricing 🚀'}</span>
                                    </button>

                                    <p className="text-slate-500 text-xs text-center leading-relaxed font-medium">
                                        <FaLock className="inline text-slate-400 mr-1" /> Responded within 24 hours via WhatsApp. Your inquiry is 100% confidential.
                                    </p>
                                </form>
                            </div>
                        </div>

                        {/* BENEFITS SIDEBAR */}
                        <div className="lg:col-span-4 space-y-5 text-left">
                            <div className="p-6 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
                                <h4 className="text-[#C8952B] font-bold text-lg mb-2">Direct Factory Pricing</h4>
                                <p className="text-slate-200 text-xs leading-relaxed">Eliminate middleman commissions and save up to 35% on volume glass purchases.</p>
                            </div>

                            <div className="p-6 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
                                <h4 className="text-[#C8952B] font-bold text-lg mb-2">Custom Branding Options</h4>
                                <p className="text-slate-200 text-xs leading-relaxed">Get custom frosting, logo screen printing, and bespoke color spraying for your brand.</p>
                            </div>

                            <div className="p-6 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
                                <h4 className="text-[#C8952B] font-bold text-lg mb-2">Zero Breakage Packaging</h4>
                                <p className="text-slate-200 text-xs leading-relaxed">Heavy-duty multi-layer corrugated export packaging designed for safe freight travel.</p>
                            </div>

                            <div className="p-6 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
                                <h4 className="text-[#C8952B] font-bold text-lg mb-2">Pan-India Dispatch</h4>
                                <p className="text-slate-200 text-xs leading-relaxed">Reliable logistics partners providing door-step delivery with end-to-end tracking.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* SECTION 6 — MANUFACTURER ADVANTAGE & COMPARISON */}
            <section className="py-16 md:py-24 border-b border-slate-200/60 bg-white">
                <div className="container mx-auto px-4 max-w-7xl text-center">
                    <span className="text-[#C8952B] text-xs font-bold uppercase tracking-widest">Manufacturer Advantage</span>
                    <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#10263E] mt-2 mb-4 tracking-tight">
                        Why Buy Direct From the Manufacturer?
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto mb-12 font-medium">
                        Collaborate directly with Firozabad production facilities to grow your retail or wholesale margin.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left mb-12">
                        {[
                            {
                                icon: FaIndustry,
                                title: 'Direct Manufacturer',
                                text: 'Source directly from our state-of-the-art glass furnaces in Firozabad with full quality control.'
                            },
                            {
                                icon: FaBoxes,
                                title: 'Bulk Supply Capacity',
                                text: 'Production capacity exceeding 50,000 units per month for enterprise supply reliability.'
                            },
                            {
                                icon: FaCog,
                                title: 'Customization Options',
                                text: 'Bespoke glass molds, color coatings, frosted finishes, and private label branding.'
                            },
                            {
                                icon: FaShieldAlt,
                                title: 'Quality Control',
                                text: 'Strict 3-stage thermal shock, rim integrity, and wall thickness inspection on every batch.'
                            },
                            {
                                icon: FaTruck,
                                title: 'Pan-India Supply',
                                text: 'Seamless door-step shipping across all states in India with transit insurance options.'
                            },
                            {
                                icon: FaLayerGroup,
                                title: 'Glass + Candle Range',
                                text: 'Single supplier for both empty glass vessels and finished wax-poured scented candles.'
                            }
                        ].map((item, idx) => {
                            const IconComp = item.icon;
                            return (
                                <div key={idx} className="p-6 rounded-2xl bg-[#F8F6F3] border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300">
                                    <div className="w-11 h-11 rounded-xl bg-[#FFF8E7] text-[#C8952B] flex items-center justify-center font-bold mb-4 text-lg">
                                        <IconComp />
                                    </div>
                                    <h3 className="text-lg font-bold text-[#1A3C5E] mb-2">{item.title}</h3>
                                    <p className="text-slate-600 text-xs leading-relaxed font-medium">{item.text}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* COMPARISON INFOGRAPHIC */}
                    <div className="p-8 sm:p-10 rounded-3xl bg-[#F8F6F3] border border-slate-200 max-w-5xl mx-auto shadow-md mb-12 text-left">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-serif font-extrabold text-[#1A3C5E]">Factory Direct vs. Trader / Middlemen</h3>
                            <p className="text-slate-600 text-xs sm:text-sm mt-1 font-medium">See how buying directly from Raja Home Decor protects your profits.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-500">
                                <h4 className="text-lg font-bold text-emerald-900 mb-4">Buying Direct (Raja Home Decor)</h4>
                                <ul className="space-y-3 text-xs font-bold text-emerald-800">
                                    <li className="flex items-center gap-2">✓ Factory Base Wholesale Pricing</li>
                                    <li className="flex items-center gap-2">✓ Custom Molds & Color Spraying</li>
                                    <li className="flex items-center gap-2">✓ Direct Quality Guarantee from Unit</li>
                                    <li className="flex items-center gap-2">✓ Priority Batch Manufacturing</li>
                                </ul>
                            </div>

                            <div className="p-6 rounded-2xl bg-red-50 border-2 border-red-400">
                                <h4 className="text-lg font-bold text-red-900 mb-4">Buying via Middlemen / Traders</h4>
                                <ul className="space-y-3 text-xs font-bold text-red-800">
                                    <li className="flex items-center gap-2">✕ 25% - 40% Commission Markups</li>
                                    <li className="flex items-center gap-2">✕ No Customization Support</li>
                                    <li className="flex items-center gap-2">✕ Unknown Glass Storage Conditions</li>
                                    <li className="flex items-center gap-2">✕ Higher Risk of Breakage & Delays</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* CERTIFICATIONS STRIP */}
                    <div className="flex flex-wrap items-center justify-center gap-8 font-bold text-xs sm:text-sm text-[#1A3C5E]">
                        <div className="flex items-center gap-2">
                            <FaCertificate className="text-[#C8952B]" />
                            <span>ISO 9001:2015 Certified Manufacturing</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaShieldAlt className="text-[#C8952B]" />
                            <span>Thermal Shock Tested Glass</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaAward className="text-[#C8952B]" />
                            <span>Firozabad Glass Handicraft Unit</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* TESTIMONIAL SLIDER SECTION */}
            <section className="py-16 border-b border-slate-200/60 bg-[#F8F6F3]">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <span className="text-[#C8952B] text-xs font-bold uppercase tracking-widest">Client Feedback</span>
                    <h2 className="text-3xl font-serif font-extrabold text-[#10263E] mt-2 mb-8">What Our Wholesale Partners Say</h2>

                    <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-lg text-center space-y-4">
                        <div className="text-amber-500 flex items-center justify-center gap-1 text-lg">
                            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                        </div>
                        <p className="font-serif italic text-lg sm:text-xl text-[#10263E] leading-relaxed">
                            "Sourcing our candle jars directly from Raja Home Decor reduced our container breakage to almost zero and improved our profit margins by 30%. Their Firozabad unit is our go-to partner!"
                        </p>
                        <div>
                            <div className="font-extrabold text-[#1A3C5E] text-base">Vikram Malhotra</div>
                            <div className="text-slate-500 text-xs font-medium">Founder, Lumina Candle Works (Mumbai)</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 7 — FAQ SECTION (ACCORDION STYLE) */}
            <section className="py-16 md:py-24 border-b border-slate-200/60 bg-white">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <span className="text-[#C8952B] text-xs font-bold uppercase tracking-widest">Got Questions?</span>
                    <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#10263E] mt-2 mb-10 tracking-tight">
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-4 text-left">
                        {faqs.map((faq, idx) => {
                            const isOpen = openFaq === idx;
                            return (
                                <div
                                    key={idx}
                                    className="rounded-2xl bg-[#F8F6F3] border border-slate-200 overflow-hidden shadow-sm transition-colors hover:border-[#C8952B]"
                                >
                                    <button
                                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                                        className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-base text-[#1A3C5E] hover:text-[#C8952B] transition-colors"
                                    >
                                        <span>{faq.q}</span>
                                        <FaChevronDown className={`text-xs text-[#C8952B] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isOpen && (
                                        <div className="px-6 pb-6 pt-0 text-slate-600 text-xs leading-relaxed border-t border-slate-200/80 pt-4 font-medium">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* SECTION 8 — FINAL CTA SECTION */}
            <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-br from-[#10263E] via-[#1A3C5E] to-[#10263E] text-white">
                <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center space-y-6">
                    <span className="text-[#C8952B] text-xs font-bold uppercase tracking-widest">Ready to Order?</span>
                    
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-extrabold tracking-tight text-white">
                        Have a Bulk Requirement?
                    </h2>

                    <p className="text-slate-300 text-base md:text-lg max-w-xl mx-auto leading-relaxed font-normal">
                        Tell us the product and quantity you need. Our manufacturing team in Firozabad will help you with wholesale pricing, customization options, and availability.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <button
                            onClick={() => document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full sm:w-auto px-8 py-4 bg-[#C8952B] hover:bg-[#b08120] text-white rounded-xl font-extrabold text-base transition-all duration-200 shadow-2xl flex items-center justify-center gap-2 group"
                        >
                            <span>Get Bulk Quote</span>
                            <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                        </button>

                        <a
                            href={getWhatsAppUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-8 py-4 bg-[#25D366] hover:bg-[#1DA851] text-white rounded-xl font-bold text-base transition-all duration-200 shadow-2xl flex items-center justify-center gap-3"
                        >
                            <FaWhatsapp className="text-xl" />
                            <span>WhatsApp Us</span>
                        </a>
                    </div>

                    <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-semibold">
                        <span>🔒 100% Secure Inquiry</span>
                        <span>⏱ 24-Hour Response Guarantee</span>
                        <span>💬 Free Consultation & Catalog</span>
                    </div>
                </div>
            </section>

            {/* SECTION 9 — FOOTER */}
            <footer className="bg-[#0B192C] text-slate-400 py-12 border-t border-slate-800 text-xs">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-left">
                        <div>
                            <h3 className="text-white font-extrabold text-lg mb-3">Raja Home Decor</h3>
                            <p className="leading-relaxed mb-3">Direct manufacturer and supplier of glass candle jars, vases, planters, decorative glassware, and candles. Manufacturing unit backed by Aqsha Glass in Firozabad, Uttar Pradesh, India.</p>
                            <div className="text-[#C8952B] font-bold">Factory Address: Industrial Area, Firozabad, UP 283203</div>
                        </div>

                        <div>
                            <h4 className="text-white font-bold text-sm mb-3">Quick Links</h4>
                            <ul className="space-y-2">
                                <li><a href="/" className="hover:text-[#C8952B] transition-colors">Retail Store Home</a></li>
                                <li><a href="#categories" className="hover:text-[#C8952B] transition-colors">Product Categories</a></li>
                                <li><a href="#enquiry-form" className="hover:text-[#C8952B] transition-colors">Bulk Quote Form</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold text-sm mb-3">Contact Sales Office</h4>
                            <ul className="space-y-2">
                                <li>Phone: +91 9258063524</li>
                                <li>Email: rajahomedecor10@gmail.com</li>
                                <li>WhatsApp: +91 9258063524</li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-800 text-center text-slate-500">
                        &copy; 2024 Raja Home Decor. Associated Manufacturing Unit: Aqsha Glass. All rights reserved.
                    </div>
                </div>
            </footer>

            {/* FLOATING QUICK QUOTE BUTTON */}
            <button
                onClick={() => document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="fixed bottom-6 right-6 z-40 bg-[#C8952B] hover:bg-[#b08120] text-white px-5 py-3 rounded-full font-bold text-xs shadow-2xl flex items-center gap-2 transition-transform hover:scale-105"
            >
                <FaArrowRight className="text-xs" />
                <span>Quick Quote</span>
            </button>

            {/* MOBILE FLOATING STICKY CTA TOOLBAR */}
            <div className="fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-lg border-t border-slate-200 z-50 md:hidden flex items-center gap-3 shadow-2xl">
                <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 bg-[#25D366] active:bg-[#1DA851] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md"
                >
                    <FaWhatsapp className="text-base" />
                    <span>WhatsApp</span>
                </a>
                <button
                    onClick={() => document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' })}
                    className="flex-1 py-3 bg-[#C8952B] text-white active:bg-[#b08120] rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                    <span>Get Quote</span>
                    <FaArrowRight className="text-[10px]" />
                </button>
            </div>

            {/* FACTORY VIDEO MODAL */}
            {isVideoModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-2xl w-full text-center relative shadow-2xl">
                        <button 
                            onClick={() => setIsVideoModalOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 text-xl"
                        >
                            <FaTimes />
                        </button>
                        <h3 className="text-xl font-serif font-extrabold text-[#1A3C5E] mb-4">Firozabad Factory Unit Live Reel</h3>
                        <div className="aspect-video bg-black rounded-2xl overflow-hidden mb-4">
                            <iframe 
                                className="w-full h-full" 
                                src="https://www.youtube.com/embed/2vjPBrBU-TM?autoplay=1&mute=1" 
                                title="Manufacturing Process Video"
                                allow="autoplay; encrypted-media"
                            />
                        </div>
                        <button 
                            onClick={() => setIsVideoModalOpen(false)}
                            className="w-full py-3 bg-[#C8952B] text-white font-bold rounded-xl text-sm"
                        >
                            Close Player
                        </button>
                    </div>
                </div>
            )}

            {/* EXIT INTENT POPUP */}
            {isExitModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center relative shadow-2xl">
                        <button 
                            onClick={() => setIsExitModalOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 text-xl"
                        >
                            <FaTimes />
                        </button>
                        <div className="w-14 h-14 rounded-full bg-[#FFF8E7] text-[#C8952B] flex items-center justify-center text-2xl mx-auto mb-4">
                            <FaAward />
                        </div>
                        <h3 className="text-2xl font-serif font-extrabold text-[#1A3C5E] mb-2">Download Wholesale Catalog</h3>
                        <p className="text-slate-600 text-xs leading-relaxed mb-6 font-medium">Get factory pricing, dimensions, and MOQ list for all 500+ glass & candle SKUs directly on WhatsApp.</p>
                        
                        <a 
                            href={getWhatsAppUrl("Hi Raja Home Decor, please send me your latest wholesale PDF catalog.")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-3.5 bg-[#25D366] hover:bg-[#1DA851] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg"
                        >
                            <FaWhatsapp className="text-lg" />
                            <span>Get Catalog on WhatsApp</span>
                        </a>
                    </div>
                </div>
            )}

        </div>
    );
};
