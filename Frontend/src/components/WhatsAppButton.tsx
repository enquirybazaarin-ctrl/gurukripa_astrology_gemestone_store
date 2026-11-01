import { FaWhatsapp } from 'react-icons/fa'; // Assuming react-icons/fa is available, usually is. If not use FiMessageCircle.
import { trackPixelEvent } from '../utils/metaPixel';

export const WhatsAppButton = () => {
    // Admin phone number - ideally from env or config. Using a default or provided one.
    // The previously used context mentioned ADMIN_PHONES or similar.
    const phoneNumber = "919323600011"; // Guru Kripa Astrology & GemsTone
    const message = "Namaste, I am interested in certified gemstones and Vedic astrology consultation.";

    const handleClick = () => {
        trackPixelEvent('Contact', { channel: 'WhatsApp Floating Button' });
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <button
            onClick={handleClick}
            className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-40 bg-[#25D366] text-white p-3 md:p-4 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
            title="Chat with us on WhatsApp"
        >
            <FaWhatsapp size={28} />
        </button>
    );
};
