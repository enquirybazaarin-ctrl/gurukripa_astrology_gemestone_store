import React from 'react';
import { 
  FiPhoneCall, 
  FiPhone, 
  FiCheckCircle, 
  FiClock, 
  FiShield, 
  FiStar, 
  FiCompass, 
  FiAward, 
  FiTrendingUp, 
  FiHeart, 
  FiSun,
  FiBookOpen,
  FiLayers
} from 'react-icons/fi';
import { FaWhatsapp, FaOm } from 'react-icons/fa';
import { trackPixelEvent } from '../utils/metaPixel';

interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  highlights: string[];
  icon: React.ElementType;
  gradient: string;
  iconBg: string;
}

const ASTROLOGY_SERVICES: ServiceItem[] = [
  {
    id: 'janam-kundli',
    title: 'Janam Kundli Analysis',
    subtitle: 'Complete Horoscope & Life Roadmap',
    badge: 'Most Popular',
    description: 'In-depth analysis of 12 planetary houses, running Mahadashas, Antardashas, and complete life guidance covering career, health, and finances.',
    highlights: ['12 Bhavas & Planetary Aspects', 'Mahadasha & Shani Sade Sati Impact', 'Accurate Vedic Remedial Solutions'],
    icon: FiSun,
    gradient: 'from-amber-500/10 to-orange-500/5',
    iconBg: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'kundli-milan',
    title: 'Kundli Milan & Matchmaking',
    subtitle: 'Horoscope Matching for Marriage',
    badge: 'Marriage Harmony',
    description: '36 Gun Milan, Manglik Dosha evaluation, Bhakoot and Nadi Dosha remedies to ensure a blissful, long-lasting and prosperous married life.',
    highlights: ['Ashtakoot 36 Guna Milan', 'In-depth Manglik Dosha Check', 'Remedies for Marital Harmony'],
    icon: FiHeart,
    gradient: 'from-rose-500/10 to-pink-500/5',
    iconBg: 'bg-rose-100 text-rose-700',
  },
  {
    id: 'career-business',
    title: 'Career & Business Astrology',
    subtitle: 'Job, Promotions & Business Growth',
    badge: 'Career Growth',
    description: 'Determine Job vs Business alignment, promotion prospects, favorable periods for career transitions, and auspicious timing for new ventures.',
    highlights: ['Job vs Business Compatibility', 'Promotion & Salary Hike Timing', 'Business Expansion Remedies'],
    icon: FiTrendingUp,
    gradient: 'from-emerald-500/10 to-teal-500/5',
    iconBg: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'gemstone-consultation',
    title: 'Vedic Gemstone Consultation',
    subtitle: 'Accurate Lucky & Life Gemstone Selection',
    badge: 'Gemology Expert',
    description: 'Scientific determination of your 100% natural, certified, and energized lucky gemstone based on your Lagna Lord and planetary strengths.',
    highlights: ['Lagna & Yogakaraka Stone Analysis', 'Wearing Method, Day & Shubh Muhurat', 'Protection from Incompatible Stones'],
    icon: FiAward,
    gradient: 'from-orange-500/10 to-amber-500/5',
    iconBg: 'bg-orange-100 text-orange-700',
  },
  {
    id: 'dosha-nivaran',
    title: 'Dosha Nivaran & Vedic Puja',
    subtitle: 'Planetary Affliction & Puja Remedies',
    badge: 'Dosha Shanti',
    description: 'Authentic Vedic remedies and consecrated rituals for Kaal Sarp Dosha, Pitra Dosha, Mangal Dosha, and planetary peace.',
    highlights: ['Kaal Sarp & Pitra Dosha Shanti', 'Shani Dhaiya & Sade Sati Remedies', 'Pran-Pratishtha Vedic Rituals'],
    icon: FaOm,
    gradient: 'from-purple-500/10 to-indigo-500/5',
    iconBg: 'bg-purple-100 text-purple-700',
  },
  {
    id: 'vastu-shastra',
    title: 'Vastu Shastra Consultation',
    subtitle: 'Home, Shop & Commercial Vastu',
    badge: 'Space Harmonization',
    description: 'Scientific energy balancing for residences, retail stores, offices, and factories to invite wealth, health, and prosperity without demolition.',
    highlights: ['Residential & Commercial Vastu', 'Simple Non-Demolition Solutions', 'Positive Energy & Prosperity Flow'],
    icon: FiCompass,
    gradient: 'from-blue-500/10 to-cyan-500/5',
    iconBg: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'wealth-finance',
    title: 'Wealth & Debt Relief Astrology',
    subtitle: 'Financial Stability & Wealth Yogas',
    badge: 'Financial Growth',
    description: 'Astrological identification of Dhana Yogas, Lakshmi Prapti remedies, recovery of delayed payments, and debt relief strategies.',
    highlights: ['Wealth Attraction & Dhana Yogas', 'Debt Relief & Financial Stability', 'Recovery of Stuck Funds & Investments'],
    icon: FiLayers,
    gradient: 'from-yellow-500/10 to-amber-500/5',
    iconBg: 'bg-yellow-100 text-yellow-800',
  },
  {
    id: 'health-family',
    title: 'Health, Children & Family Peace',
    subtitle: 'Child Guidance & Family Harmony',
    badge: 'Peace & Well-Being',
    description: 'Remedies for child conception obstacles, academic concentration, auspicious naming (Naamkaran), and resolving household conflicts.',
    highlights: ['Child Birth & Auspicious Naming', 'Academic Focus & Higher Education', 'Domestic Peace & Dispute Resolution'],
    icon: FiBookOpen,
    gradient: 'from-teal-500/10 to-emerald-500/5',
    iconBg: 'bg-teal-100 text-teal-700',
  },
];

export const AstrologyServicesSection: React.FC = () => {
  const phoneNumber = '+919323600011';
  const displayPhone = '+91 93236 00011';

  const handleCallClick = (source: string) => {
    trackPixelEvent('Contact', { channel: 'Direct Call Button', source });
  };

  const handleWhatsAppClick = (serviceTitle: string) => {
    trackPixelEvent('Contact', { channel: 'WhatsApp Service Booking', service: serviceTitle });
    const message = `Hello Acharya Ji, I would like to consult with you regarding "${serviceTitle}". Please guide me with your expert advice.`;
    window.open(`https://wa.me/919323600011?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section id="astrology-services" className="scroll-mt-24 bg-gradient-to-b from-white via-orange-50/25 to-white rounded-2xl md:rounded-3xl shadow-sm border border-orange-100/70 p-4 sm:p-6 md:p-8 my-6 overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Section Header */}
      <div className="relative text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 bg-[#eb651e]/10 text-[#eb651e] border border-[#eb651e]/20 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-3 tracking-wide shadow-sm">
          <FaOm className="text-base text-[#eb651e]" />
          <span>Vedic Astrology & Divine Guidance Services</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Talk to Our Senior Vedic Astrologer & Consult All Astrology Services
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mt-2.5 max-w-2xl mx-auto leading-relaxed">
          Benefit from our Senior Astrologer’s <strong>25+ years of Vedic experience</strong> to receive accurate horoscope predictions, matchmaking, career guidance, and certified gemstone remedies.
        </p>
      </div>

      {/* Astrologer Experience & Profile Feature Card */}
      <div className="relative bg-gradient-to-br from-[#1a1310] via-[#241a14] to-[#120d0a] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-9 shadow-xl border border-amber-900/40 mb-10 overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#eb651e]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          {/* Left / Astrologer Info */}
          <div className="flex-1 space-y-4 sm:space-y-5 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <span className="bg-[#eb651e] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow">
                <FiAward className="text-sm" /> 25+ Years of Vedic Mastery
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live on Call • Available Now
              </span>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center justify-center lg:justify-start gap-2">
                <span>Acharya Ji (Senior Vedic Astrologer & Gemologist)</span>
              </h3>
              <p className="text-amber-400 text-sm sm:text-base font-semibold mt-1">
                Gold Medalist Jyotish Ratna • Kundli Specialist • Ratna Vigyan Authority
              </p>
            </div>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              At Guru Kripa Astrology, Acharya Ji has guided over <strong>50,000+ individuals and families</strong> across India and worldwide through traditional Parashari Astrology, Prashna Kundli, and scientific Gemstone Therapy. Every consultation provides practical, scripturally backed remedies with complete transparency and zero superstition.
            </p>

            {/* Experience & Stats Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <div className="text-xl sm:text-2xl font-black text-amber-400">25+</div>
                <div className="text-[11px] sm:text-xs text-gray-400 font-medium">Years Experience</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <div className="text-xl sm:text-2xl font-black text-amber-400">50K+</div>
                <div className="text-[11px] sm:text-xs text-gray-400 font-medium">Kundlis Analyzed</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <div className="text-xl sm:text-2xl font-black text-amber-400">99.4%</div>
                <div className="text-[11px] sm:text-xs text-gray-400 font-medium">Positive Feedback</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <div className="text-xl sm:text-2xl font-black text-amber-400">100%</div>
                <div className="text-[11px] sm:text-xs text-gray-400 font-medium">Confidential</div>
              </div>
            </div>
          </div>

          {/* Right / Direct Call CTA Card */}
          <div className="w-full lg:w-auto lg:min-w-[340px] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 sm:p-6 text-center flex flex-col items-center justify-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#eb651e] to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
              <FiPhoneCall className="w-8 h-8 animate-bounce" />
            </div>

            <div>
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-widest">
                Direct Telephonic Consultation
              </span>
              <h4 className="text-lg sm:text-xl font-bold text-white mt-1">
                Speak Directly with Astrologer
              </h4>
              <p className="text-xs text-gray-300 mt-1">
                Get immediate personalized clarity and solutions on call
              </p>
            </div>

            <div className="w-full space-y-2.5">
              {/* Call Link */}
              <a
                href={`tel:${phoneNumber}`}
                onClick={() => handleCallClick('Astrologer Profile Banner')}
                className="w-full inline-flex items-center justify-center gap-2.5 bg-[#eb651e] hover:bg-[#d25515] text-white font-bold py-3.5 px-6 rounded-xl text-base sm:text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-600/30"
              >
                <FiPhone className="text-xl" />
                <span>Call Now: {displayPhone}</span>
              </a>

              {/* WhatsApp Link */}
              <button
                onClick={() => handleWhatsAppClick('Complete Astrology Consultation')}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all shadow"
              >
                <FaWhatsapp className="text-lg" />
                <span>Book Consultation on WhatsApp</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <FiClock className="text-amber-400" />
              <span>Consultation Hours: 10:00 AM – 08:30 PM (Daily)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Highlights Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <div className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-orange-100 text-[#eb651e] flex items-center justify-center shrink-0">
            <FiPhoneCall className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">Instant Phone Consultation</div>
            <div className="text-[10px] sm:text-xs text-gray-500">Direct 1-on-1 call with expert</div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <FiShield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">100% Confidential</div>
            <div className="text-[10px] sm:text-xs text-gray-500">Birth details kept private</div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <FiStar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">Precise Vedic Calculations</div>
            <div className="text-[10px] sm:text-xs text-gray-500">Authentic Parashari system</div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <FiCheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">Proven Remedial Solutions</div>
            <div className="text-[10px] sm:text-xs text-gray-500">Consecrated gems & pujas</div>
          </div>
        </div>
      </div>

      {/* Services Grid Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>Our Comprehensive Astrology Services</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#eb651e]/10 text-[#eb651e]">
              8 Core Services
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Select your required consultation below and call our astrologer directly for instant assistance
          </p>
        </div>

        <a
          href={`tel:${phoneNumber}`}
          onClick={() => handleCallClick('Services Grid Header')}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#eb651e] hover:text-[#d25515] transition-colors self-start sm:self-auto"
        >
          <FiPhone className="text-base" />
          <span>Direct Helpline: {displayPhone}</span>
        </a>
      </div>

      {/* Services Grid (8 Services Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {ASTROLOGY_SERVICES.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.id}
              id={service.id}
              className="scroll-mt-28 group bg-white rounded-2xl border border-gray-200/80 hover:border-[#eb651e] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
            >
              {/* Top Accent Gradient Bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-[#eb651e] to-orange-500" />

              <div className="p-4 sm:p-5 flex-1 flex flex-col">
                {/* Header within Card: Icon + Badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className={`w-12 h-12 rounded-xl ${service.iconBg} flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon />
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-orange-50 text-[#eb651e] border border-orange-200/60">
                    {service.badge}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#eb651e] transition-colors leading-snug">
                    {service.title}
                  </h4>
                  <p className="text-xs font-semibold text-[#eb651e] mt-0.5">
                    {service.subtitle}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-600 mt-2.5 leading-relaxed line-clamp-3">
                  {service.description}
                </p>

                {/* Key Highlights list */}
                <div className="mt-3.5 pt-3 border-t border-gray-100 flex-1 space-y-1.5">
                  {service.highlights.map((point, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-gray-700">
                      <FiCheckCircle className="text-emerald-500 shrink-0 text-xs" />
                      <span className="line-clamp-1">{point}</span>
                    </div>
                  ))}
                </div>

                {/* Direct Action Buttons: Call & WhatsApp */}
                <div className="mt-5 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
                  {/* Direct Call Button */}
                  <a
                    href={`tel:${phoneNumber}`}
                    onClick={() => handleCallClick(`Card: ${service.title}`)}
                    className="inline-flex items-center justify-center gap-1.5 bg-[#eb651e] hover:bg-[#d25515] text-white text-xs font-bold py-2.5 px-2 rounded-xl transition-all shadow-sm hover:shadow"
                    title={`Call for ${service.title}`}
                  >
                    <FiPhoneCall className="text-sm shrink-0" />
                    <span>Direct Call</span>
                  </a>

                  {/* WhatsApp Consultation */}
                  <button
                    onClick={() => handleWhatsAppClick(service.title)}
                    className="inline-flex items-center justify-center gap-1.5 bg-[#25D366]/10 hover:bg-[#25D366] text-[#128C7E] hover:text-white text-xs font-bold py-2.5 px-2 rounded-xl border border-[#25D366]/30 transition-all"
                    title={`Consult on WhatsApp for ${service.title}`}
                  >
                    <FaWhatsapp className="text-sm shrink-0" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Call to Action Banner */}
      <div className="mt-8 bg-gradient-to-r from-orange-500 via-[#eb651e] to-amber-600 rounded-2xl p-5 sm:p-7 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="text-center md:text-left space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full mb-1">
            <FiPhoneCall className="text-xs" /> Instant Guidance
          </div>
          <h4 className="text-lg sm:text-2xl font-extrabold tracking-tight">
            Need Instant Answers to Your Life Questions?
          </h4>
          <p className="text-xs sm:text-sm text-orange-100 max-w-xl">
            Speak directly with our senior astrologer on phone to get personalized horoscope guidance and proven Vedic remedial solutions.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto shrink-0">
          <a
            href={`tel:${phoneNumber}`}
            onClick={() => handleCallClick('Bottom CTA Banner')}
            className="inline-flex items-center justify-center gap-2.5 bg-white text-gray-900 hover:bg-gray-100 font-extrabold px-6 py-3.5 rounded-xl text-sm sm:text-base transition-all shadow-md hover:scale-105 active:scale-95"
          >
            <FiPhone className="text-lg text-[#eb651e]" />
            <span>Call Now: {displayPhone}</span>
          </a>

          <button
            onClick={() => handleWhatsAppClick('Astrology Consultation Quick Help')}
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold px-5 py-3.5 rounded-xl text-sm transition-all shadow-md hover:scale-105"
          >
            <FaWhatsapp className="text-lg" />
            <span>Chat on WhatsApp</span>
          </button>
        </div>
      </div>
    </section>
  );
};
