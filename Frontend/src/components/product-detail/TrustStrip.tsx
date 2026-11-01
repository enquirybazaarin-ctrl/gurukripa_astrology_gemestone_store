import { FiShield, FiTruck, FiCreditCard, FiAward } from 'react-icons/fi';

export const TrustStrip = () => {
    const items = [
        { icon: FiShield, title: '1 Year Warranty', desc: 'On manufacturing defects' },
        { icon: FiTruck, title: 'Free Shipping', desc: 'On orders above ₹999' },
        { icon: FiCreditCard, title: 'Secure Payment', desc: 'Starting with SSL' },
        { icon: FiAward, title: 'Top Quality', desc: 'Certified products' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-t border-b border-gray-100 my-8">
            {items.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center p-2">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 text-primary-600">
                        <item.icon size={20} />
                    </div>
                    <h4 className="font-bold text-sm text-gray-900">{item.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                </div>
            ))}
        </div>
    );
};
