import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { api } from '../services/api'; // Import the configured api instance

export const AnnouncementBar = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [text, setText] = useState('✨ 100% Certified Natural Vedic Gemstones | Free Pran Pratishtha Pooja & Lab Report Included 🕉️'); // Default fallback
    const [isActiveSetting, setIsActiveSetting] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // Fetch from the public route in settings
                const response = await api.get('/settings/public/announcement_bar');
                if (response.data.success && response.data.data.setting) {
                    const setting = response.data.data.setting.value;
                    setIsActiveSetting(setting.isActive);
                    if (setting.text) {
                        setText(setting.text);
                    }
                }
            } catch (error) {
                // If it fails (e.g. 404 because setting isn't created yet), we just use the default fallback state
                console.log('Using default announcement bar settings');
            }
        };

        fetchSettings();
    }, []);

    // If dismissed by user OR hidden by admin setting, do not render
    if (!isVisible || !isActiveSetting) return null;

    return (
        <div className="bg-primary-900 text-white px-4 py-2 text-sm relative z-50 transition-all">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex-1 text-center font-medium">
                    {text}
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute right-4 text-white/80 hover:text-white"
                    aria-label="Close announcement"
                >
                    <FiX />
                </button>
            </div>
        </div>
    );
};
