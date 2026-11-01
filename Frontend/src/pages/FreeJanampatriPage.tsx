import React, { useState } from 'react';
import { 
  FiCalendar, 
  FiClock, 
  FiMapPin, 
  FiUser, 
  FiPhone, 
  FiMail, 
  FiCheckCircle, 
  FiShield, 
  FiStar, 
  FiAward, 
  FiPhoneCall, 
  FiChevronDown, 
  FiChevronUp,
  FiHelpCircle,
  FiArrowRight
} from 'react-icons/fi';
import { FaWhatsapp, FaOm } from 'react-icons/fa';
import { api } from '../services/api';
import { SEO } from '../components/SEO';
import { toast } from 'react-hot-toast';

interface FormData {
  fullName: string;
  gender: 'male' | 'female' | 'other';
  dob: string;
  birthTime: string;
  isTimeUnknown: boolean;
  birthPlace: string;
  primaryConcern: string;
  phone: string;
  email: string;
  notes: string;
}

const CONCERN_OPTIONS = [
  { id: 'gemstone', label: '💎 Lucky Gemstone Recommendation (भाग्यशाली रत्न परामर्श)', desc: 'Find your life & fortune gemstone' },
  { id: 'career', label: '💼 Career, Job Promotion & Business (व्यापार व नौकरी में उन्नति)', desc: 'Promotions, job change, business growth' },
  { id: 'marriage', label: '💍 Marriage, Delay & Kundli Milan (शीघ्र विवाह व वैवाहिक सुख)', desc: 'Delay in marriage, compatibility' },
  { id: 'wealth', label: '💰 Wealth, Debts & Financial Stability (धन लाभ व कर्ज मुक्ति)', desc: 'Financial security & growth yogas' },
  { id: 'dosha', label: '🧿 Sade Sati, Manglik & Dosha Nivaran (शनि साढ़े साती व कालसर्प दोष)', desc: 'Planetary peace & puja remedies' },
  { id: 'health', label: '🌿 Health, Family Peace & Children (स्वास्थ्य व सन्तान सुख)', desc: 'Domestic harmony & child welfare' },
];

const FAQS = [
  {
    q: 'जन्मपत्री परामर्श पूर्णतः निःशुल्क क्यों है? (Why is it 100% Free?)',
    a: 'सनातन वैदिक ज्योतिष परम्परा के अनुसार ग्रह-दोषों का सही निदान होना प्रथम कर्तव्य है। आचार्य जी का संकल्प है कि हर व्यक्ति को अपने भाग्य, ग्रह दशा और सही रत्न की सटीक जानकारी निःशुल्क मिले ताकि वे भ्रामक उपचारों से बच सकें।'
  },
  {
    q: 'यदि मुझे जन्म का सही समय नहीं पता तो क्या करें? (What if exact birth time is unknown?)',
    a: 'यदि आपको जन्म समय ज्ञात नहीं है, तो फॉर्म में "जन्म समय ज्ञात नहीं" पर टिक करें। आचार्य जी आपकी हस्तरेखा (Palmistry), प्रश्न कुंडली (Horary Astrology) एवं मुख-लक्षण (Face Reading) के माध्यम से सटीक फलित करते हैं।'
  },
  {
    q: 'मुझे जन्मपत्री व रत्न रिपोर्ट कैसे प्राप्त होगी? (How will I receive the report?)',
    a: 'फॉर्म सबमिट करते ही आपकी जन्मपत्री का विवरण आचार्य जी के पास पहुँच जाता है। 2 घंटे के भीतर आचार्य जी की टीम आपके WhatsApp नंबर पर संपूर्ण कुंडली चार्ट, महादशा विश्लेषण व रत्न परामर्श भेज देती है।'
  },
  {
    q: 'क्या अनुशंसित रत्न 100% प्राकृतिक एवं प्रमाणित होते हैं? (Are gemstones authentic?)',
    a: 'हाँ, गुरु कृपा जेम्स के सभी रत्न 100% प्राकृतिक, बिना किसी हीटिंग या केमिकल ट्रीटमेंट वाले होते हैं। प्रत्येक रत्न के साथ सरकारी मान्यता प्राप्त (Govt. Lab Certified) टेस्टिंग लैब सर्टिफिकेट और लाइफटाइम गारंटी कार्ड दिया जाता है।'
  },
  {
    q: 'रत्न धारण करने से पहले क्या वैदिक पूजा आवश्यक है? (Is Vedic Consecration included?)',
    a: 'हाँ, वैदिक ज्योतिष के अनुसार जातक के नाम, गोत्र और नक्षत्र के अनुसार रत्न को प्राण-प्रतिष्ठित (Energized & Consecrated) करना अनिवार्य है। हमारे सभी रत्न काशी-प्रयागराज के वैदिक आचार्यों द्वारा सिद्ध करके भेजे जाते हैं।'
  }
];

export const FreeJanampatriPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    gender: 'male',
    dob: '',
    birthTime: '',
    isTimeUnknown: false,
    birthPlace: '',
    primaryConcern: CONCERN_OPTIONS[0].label,
    phone: '',
    email: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, isTimeUnknown: e.target.checked }));
  };

  const formatWhatsAppMessage = (data: FormData) => {
    return `*जय श्री राम | निःशुल्क जन्मपत्री व रत्न परामर्श आवेदन*
---------------------------------------
👤 *नाम:* ${data.fullName}
🚻 *लिंग:* ${data.gender === 'male' ? 'पुरुष (Male)' : data.gender === 'female' ? 'महिला (Female)' : 'अन्य'}
📅 *जन्म तिथि (DOB):* ${data.dob}
⏰ *जन्म समय (Time):* ${data.isTimeUnknown ? 'ज्ञात नहीं (Unknown - प्रश्न कुंडली)' : data.birthTime || 'Not Specified'}
📍 *जन्म स्थान (Place):* ${data.birthPlace}
🎯 *मुख्य प्रश्न:* ${data.primaryConcern}
📞 *फोन नंबर:* ${data.phone}
${data.email ? `✉️ *ईमेल:* ${data.email}\n` : ''}${data.notes ? `📝 *विशेष समस्या:* ${data.notes}\n` : ''}---------------------------------------
कृपया मेरी जन्मपत्री का विश्लेषण कर मुझे भाग्यशाली वैदिक रत्न व उपाय मार्गदर्शन प्रदान करें।`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error('कृपया अपना नाम दर्ज करें');
      return;
    }
    if (!formData.dob) {
      toast.error('कृपया अपनी जन्म तिथि दर्ज करें');
      return;
    }
    if (!formData.birthPlace.trim()) {
      toast.error('कृपया अपना जन्म स्थान दर्ज करें');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      toast.error('कृपया 10 अंकों का मान्य मोबाइल/WhatsApp नंबर दर्ज करें');
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit lead to database via inquiries API
      const detailedMessage = `FREE JANAMPATRI LEAD:
DOB: ${formData.dob}
Time: ${formData.isTimeUnknown ? 'Exact Time Unknown (Prashna Kundli)' : formData.birthTime || 'Not Provided'}
Place: ${formData.birthPlace}
Gender: ${formData.gender}
Concern: ${formData.primaryConcern}
Notes: ${formData.notes || 'None'}`;

      await api.post('/bulk-enquiries', {
        name: formData.fullName,
        email: formData.email.trim() || `${formData.phone}@gurukripagems.com`,
        phone: formData.phone,
        category: 'Free Janam Kundli Consultation',
        quantity: 'Individual',
        message: detailedMessage
      });

      setIsSubmitted(true);
      toast.success('जय श्री राम! आपकी जन्मपत्री का विवरण प्राप्त हो गया है।');
      window.scrollTo({ top: 180, behavior: 'smooth' });

    } catch (error: any) {
      console.error('Failed to submit Janampatri request', error);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsAppUrl = `https://wa.me/919323600011?text=${encodeURIComponent(formatWhatsAppMessage(formData))}`;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-gray-900 font-sans selection:bg-orange-100 selection:text-orange-900 pb-28 md:pb-16">
      <SEO 
        title="100% Free Janam Kundli & Gemstone Recommendation | Guru Kripa Astrology & Gems Stone"
        description="Get your 100% Free Vedic Janam Kundli analysis and lucky gemstone recommendation by Acharya Ji. Detailed horoscope, planetary dasha & remedies on WhatsApp."
      />

      {/* ─────────────────────────────────────────────────────────────
          1. SACRED HERO BANNER
      ───────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-b from-[#1C1D21] via-[#242226] to-[#1C1D21] text-white pt-10 pb-16 md:pt-14 md:pb-20 overflow-hidden border-b-2 border-[#eb651e]/40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 bg-gradient-to-r from-amber-500/15 via-rose-500/20 to-orange-500/15 blur-3xl pointer-events-none rounded-full" />
        
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/15 border border-orange-400/30 text-amber-300 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 shadow-sm animate-pulse">
            <FaOm className="text-base text-amber-400" />
            <span>वैदिक जन्मपत्री एवं रत्न मार्गदर्शन • 100% Free Consultation</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight sm:leading-snug text-white">
            निःशुल्क जन्मपत्री व <span className="text-[#eb651e] bg-gradient-to-r from-amber-400 to-[#eb651e] bg-clip-text text-transparent">भाग्यशाली रत्न परामर्श</span>
          </h1>

          <p className="mt-3.5 text-xs sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            आचार्य जी (25+ वर्षों का वैदिक अनुभव, स्वर्ण पदक विजेता) द्वारा अपनी जन्म कुंडली, ग्रह-दशा एवं भाग्य उदय करने वाले प्रमाणित रत्न की सटीक जानकारी प्राप्त करें।
          </p>

          {/* Quick Stats Grid */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto text-left">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <FiAward size={18} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-black text-white">25+ Years</p>
                <p className="text-[10px] text-gray-400 font-medium">Vedic Experience</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <FiCheckCircle size={18} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-black text-white">50,000+</p>
                <p className="text-[10px] text-gray-400 font-medium">Kundlis Analysed</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <FiStar size={18} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-black text-white">100% Free</p>
                <p className="text-[10px] text-gray-400 font-medium">No Hidden Charges</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <FiShield size={18} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-black text-white">Govt. Lab</p>
                <p className="text-[10px] text-gray-400 font-medium">Certified Gems</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN CONTENT & INTERACTIVE KUNDLI FORM
      ───────────────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 -mt-8 relative z-20 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT 7 COLS: FORM OR SUCCESS STATE */}
          <div className="lg:col-span-7 bg-white rounded-3xl shadow-xl border border-gray-200/90 overflow-hidden">
            {isSubmitted ? (
              /* Success Submission Card */
              <div className="p-6 sm:p-10 text-center animate-in fade-in duration-300">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl sm:text-3xl shadow-inner">
                  ✓
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-[#eb651e] text-xs font-bold uppercase mb-2">
                  <FaOm />
                  <span>जय श्री राम • आवेदन सफल</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                  धन्यवाद, {formData.fullName}!
                </h3>
                
                <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-md mx-auto leading-relaxed">
                  आपकी जन्मपत्री का विवरण सफलतापूर्वक आचार्य जी के पास पहुँच गया है। आपकी ग्रह दशा एवं लग्न चक्र की गणना की जा रही है।
                </p>

                {/* Instant WhatsApp Action Card */}
                <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/80 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <FaWhatsapp className="text-xl" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">तुरंत WhatsApp पर फलित प्राप्त करें</p>
                      <p className="text-[11px] text-gray-600 mt-0.5">
                        आचार्य जी से तुरंत WhatsApp पर जुड़ें और 10 मिनट में अपनी कुंडली व भाग्यशाली रत्न की रिपोर्ट पाएं।
                      </p>
                    </div>
                  </div>

                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
                  >
                    <FaWhatsapp className="text-lg" />
                    <span>WhatsApp पर आचार्य जी से रिपोर्ट प्राप्त करें</span>
                  </a>
                </div>

                {/* Direct Call Button */}
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <a
                    href="tel:+919323600011"
                    className="flex-1 py-3 bg-[#eb651e] hover:bg-[#d25515] text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <FiPhoneCall className="animate-pulse" />
                    <span>सीधे फोन पर बात करें: +91 93236 00011</span>
                  </a>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        fullName: '',
                        gender: 'male',
                        dob: '',
                        birthTime: '',
                        isTimeUnknown: false,
                        birthPlace: '',
                        primaryConcern: CONCERN_OPTIONS[0].label,
                        phone: '',
                        email: '',
                        notes: ''
                      });
                    }}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition-colors"
                  >
                    नया फॉर्म भरें
                  </button>
                </div>
              </div>
            ) : (
              /* Interactive Janampatri Form */
              <div className="p-5 sm:p-8">
                {/* Form Header */}
                <div className="border-b border-gray-100 pb-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
                        <span>जन्म विवरण दर्ज करें</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          100% FREE
                        </span>
                      </h2>
                      <p className="text-xs text-gray-500 mt-0.5">
                        सटीक जन्म विवरण दें ताकि कुंडली चक्र व महादशा की गणना त्रुटिरहित हो
                      </p>
                    </div>
                    <span className="text-2xl select-none">📜</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  {/* Row 1: Full Name & Gender */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <FiUser className="text-[#eb651e]" />
                        <span>पूरा नाम (Full Name) *</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="उदा. राहुल शर्मा"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#eb651e] focus:ring-2 focus:ring-[#eb651e]/20 text-xs sm:text-sm transition-all outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        लिंग (Gender) *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, gender: 'male' }))}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                            formData.gender === 'male'
                              ? 'bg-orange-50 border-[#eb651e] text-[#eb651e]'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          पुरुष (Male)
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, gender: 'female' }))}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                            formData.gender === 'female'
                              ? 'bg-orange-50 border-[#eb651e] text-[#eb651e]'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          महिला (Female)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Date of Birth & Time of Birth */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <FiCalendar className="text-[#eb651e]" />
                        <span>जन्म तिथि (Date of Birth) *</span>
                      </label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#eb651e] focus:ring-2 focus:ring-[#eb651e]/20 text-xs sm:text-sm transition-all outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <FiClock className="text-[#eb651e]" />
                        <span>जन्म समय (Time of Birth)</span>
                      </label>
                      <input
                        type="time"
                        name="birthTime"
                        value={formData.birthTime}
                        onChange={handleChange}
                        disabled={formData.isTimeUnknown}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#eb651e] focus:ring-2 focus:ring-[#eb651e]/20 text-xs sm:text-sm transition-all outline-none disabled:bg-gray-100 disabled:text-gray-400"
                      />
                      <label className="mt-1.5 flex items-center gap-2 cursor-pointer text-[11px] text-gray-600 font-medium">
                        <input
                          type="checkbox"
                          checked={formData.isTimeUnknown}
                          onChange={handleCheckboxChange}
                          className="w-3.5 h-3.5 text-[#eb651e] rounded focus:ring-0"
                        />
                        <span>जन्म समय सही ज्ञात नहीं है (प्रश्न कुंडली)</span>
                      </label>
                    </div>
                  </div>

                  {/* Row 3: Place of Birth */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <FiMapPin className="text-[#eb651e]" />
                      <span>जन्म स्थान (Place of Birth - City, State) *</span>
                    </label>
                    <input
                      type="text"
                      name="birthPlace"
                      value={formData.birthPlace}
                      onChange={handleChange}
                      placeholder="उदा. नई दिल्ली, उत्तर प्रदेश, जयपुर"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#eb651e] focus:ring-2 focus:ring-[#eb651e]/20 text-xs sm:text-sm transition-all outline-none"
                    />
                  </div>

                  {/* Row 4: Primary Concern / Topic */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <FiHelpCircle className="text-[#eb651e]" />
                      <span>मुख्य प्रश्न या परामर्श का विषय (Primary Concern) *</span>
                    </label>
                    <select
                      name="primaryConcern"
                      value={formData.primaryConcern}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#eb651e] focus:ring-2 focus:ring-[#eb651e]/20 text-xs sm:text-sm transition-all outline-none bg-white font-medium"
                    >
                      {CONCERN_OPTIONS.map((opt, idx) => (
                        <option key={idx} value={opt.label}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Row 5: WhatsApp Phone Number & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <FaWhatsapp className="text-green-600 text-sm" />
                        <span>WhatsApp / मोबाइल नंबर *</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">
                          +91
                        </span>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="98765 43210"
                          maxLength={10}
                          required
                          className="w-full pl-12 pr-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#eb651e] focus:ring-2 focus:ring-[#eb651e]/20 text-xs sm:text-sm transition-all outline-none font-semibold"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">आपकी रिपोर्ट इसी WhatsApp नंबर पर भेजी जाएगी</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <FiMail className="text-[#eb651e]" />
                        <span>ईमेल (Email - वैकल्पिक)</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="yourname@gmail.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#eb651e] focus:ring-2 focus:ring-[#eb651e]/20 text-xs sm:text-sm transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Row 6: Specific Question / Notes */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      अपनी विशेष समस्या या प्रश्न लिखें (Specific Question - Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={2}
                      placeholder="उदा. व्यापार में रुकावट आ रही है, कौन सा रत्न पहनना फलदायी रहेगा?"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:border-[#eb651e] focus:ring-2 focus:ring-[#eb651e]/20 text-xs sm:text-sm transition-all outline-none resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#eb651e] to-orange-600 hover:from-[#d25515] hover:to-orange-700 text-white font-black text-sm sm:text-base transition-all shadow-lg shadow-orange-500/25 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">गणना की जा रही है...</span>
                    ) : (
                      <>
                        <FaOm className="text-base" />
                        <span>मेरी निःशुल्क जन्मपत्री व रत्न परामर्श प्राप्त करें</span>
                        <FiArrowRight />
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-gray-400 flex items-center justify-center gap-1.5">
                    <FiShield className="text-emerald-500 text-xs" />
                    <span>आपकी व्यक्तिगत जानकारी 100% सुरक्षित और गोपनीय रखी जाती है।</span>
                  </p>
                </form>
              </div>
            )}
          </div>

          {/* RIGHT 5 COLS: REPORT PREVIEW & ACHARYA JI PROFILE */}
          <div className="lg:col-span-5 space-y-6">

            {/* Acharya Ji Profile Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/90 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100/60 rounded-bl-full pointer-events-none" />

              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 p-0.5 shadow-md shrink-0">
                  <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-2xl sm:text-3xl">
                    🧘‍♂️
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-orange-100 text-[#eb651e] px-2 py-0.5 rounded-full">
                      Gold Medalist
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-gray-900 leading-snug mt-0.5">
                    आचार्य श्री (Acharya Ji)
                  </h3>
                  <p className="text-xs font-semibold text-gray-500">
                    वरिष्ठ वैदिक ज्योतिषाचार्य एवं रत्न विशेषज्ञ
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 space-y-2 text-xs text-gray-600 leading-relaxed">
                <p>
                  "रत्न केवल आभूषण नहीं, बल्कि ब्रह्मांडीय ऊर्जा के संवाहक हैं। सही समय पर सही रत्न धारण करने से भाग्य का अवरोध स्वतः समाप्त हो जाता है।"
                </p>
              </div>

              {/* Direct Call Button */}
              <a
                href="tel:+919323600011"
                className="mt-4 w-full py-2.5 bg-[#eb651e]/10 hover:bg-[#eb651e]/20 text-[#eb651e] font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <FiPhoneCall className="animate-pulse" />
                <span>सीधे परामर्श हेतु कॉल करें: +91 93236 00011</span>
              </a>
            </div>

            {/* What is Included in Free Report */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/90 shadow-md">
              <h3 className="text-sm sm:text-base font-black text-gray-900 uppercase tracking-wider flex items-center gap-2 mb-4">
                <span>आपकी निःशुल्क रिपोर्ट में क्या शामिल है?</span>
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-orange-50/60 border border-orange-100">
                  <span className="w-6 h-6 rounded-lg bg-[#eb651e] text-white flex items-center justify-center text-xs font-bold shrink-0">1</span>
                  <div>
                    <p className="text-xs font-bold text-gray-900">लग्न चक्र एवं नवमांश विश्लेषण</p>
                    <p className="text-[11px] text-gray-600">12 भावों एवं ग्रहों की शुभ-अशुभ स्थिति का सूक्ष्म अध्ययन।</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
                  <span className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs font-bold shrink-0">2</span>
                  <div>
                    <p className="text-xs font-bold text-gray-900">चल रही महादशा व अंतर्दशा</p>
                    <p className="text-[11px] text-gray-600">वर्तमान समय में किस ग्रह का प्रभाव है और अनुकूल समय कब है।</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-rose-50/60 border border-rose-100">
                  <span className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center text-xs font-bold shrink-0">3</span>
                  <div>
                    <p className="text-xs font-bold text-gray-900">साढ़े साती, मांगलिक व कालसर्प दोष</p>
                    <p className="text-[11px] text-gray-600">जीवन में आने वाली बाधाओं के मुख्य कारण व उनके प्रभाव।</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">4</span>
                  <div>
                    <p className="text-xs font-bold text-gray-900">भाग्यशाली रत्न संस्तुति (Lucky Gemstone)</p>
                    <p className="text-[11px] text-gray-600">रत्ती वजन, धातु (पंचधातु/सोना/चांदी), धारण अंगुली व शुभ दिन।</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100">
                  <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">5</span>
                  <div>
                    <p className="text-xs font-bold text-gray-900">सरल वैदिक उपाय व बीज मंत्र</p>
                    <p className="text-[11px] text-gray-600">दैनिक जीवन में किए जाने वाले प्रभावी वैदिक उपचार।</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ─────────────────────────────────────────────────────────────
            3. FREQUENTLY ASKED QUESTIONS (FAQS)
        ───────────────────────────────────────────────────────────── */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/90 shadow-sm max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#eb651e] bg-orange-100 px-3 py-1 rounded-full">
              सामान्य प्रश्नोत्तर
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-2">
              निःशुल्क जन्मपत्री से जुड़े आपके प्रश्न (FAQs)
            </h3>
          </div>

          <div className="divide-y divide-gray-100">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="py-4">
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left gap-4 group"
                >
                  <span className={`text-xs sm:text-sm font-bold transition-colors ${
                    activeFaq === idx ? 'text-[#eb651e]' : 'text-gray-800 group-hover:text-[#eb651e]'
                  }`}>
                    {faq.q}
                  </span>
                  {activeFaq === idx ? (
                    <FiChevronUp className="text-[#eb651e] shrink-0" />
                  ) : (
                    <FiChevronDown className="text-gray-400 shrink-0" />
                  )}
                </button>

                {activeFaq === idx && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-2.5 leading-relaxed pl-1 animate-in fade-in duration-200">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

