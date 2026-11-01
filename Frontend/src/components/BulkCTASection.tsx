import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaGem } from 'react-icons/fa';

export const BulkCTASection = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-gradient-to-r from-amber-50/90 via-white to-amber-100/60 border-t border-b border-amber-200/80 my-10 relative overflow-hidden shadow-sm">
            <div className="container mx-auto px-4 py-10 md:py-14 max-w-7xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">

                    <div className="text-center md:text-left space-y-2">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider">
                            <FaGem className="text-xs text-amber-700" /> Vedic Astrology & Gemstone Experts
                        </div>
                        <h2 className="text-xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Need Free Kundli Gemstone Recommendation or Custom Ring Design?
                        </h2>
                        <p className="text-sm md:text-base text-slate-600 font-medium max-w-xl">
                            Consult with our in-house Vedic Acharyas to find your ideal planetary gemstone, or get wholesale certified loose gems crafted in Gold, Panchdhatu & Silver.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/free-janampatri')}
                        className="w-full md:w-auto bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-amber-600/25 transition-all active:scale-95 flex items-center justify-center gap-2 group shrink-0"
                    >
                        <span>Consult Astrologer / Bulk Query</span>
                        <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                    </button>

                </div>
            </div>
        </div>
    );
};
