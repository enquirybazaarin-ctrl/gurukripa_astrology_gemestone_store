import { FiShield, FiTruck, FiCheckCircle, FiRefreshCw } from 'react-icons/fi';

export const TrustBadges = () => {
    const badges = [
        {
            icon: <FiShield className="w-5 h-5" />,
            title: "Secure Payment",
            desc: "100% Secure SSL",
            color: "text-blue-600 bg-blue-50"
        },
        {
            icon: <FiTruck className="w-5 h-5" />,
            title: "Fast Delivery",
            desc: "Across India",
            color: "text-orange-600 bg-orange-50"
        },
        {
            icon: <FiCheckCircle className="w-5 h-5" />,
            title: "Please Verify",
            desc: "Original Products",
            color: "text-green-600 bg-green-50"
        },
        {
            icon: <FiRefreshCw className="w-5 h-5" />,
            title: "Easy Returns",
            desc: "7 Days Policy",
            color: "text-purple-600 bg-purple-50"
        }
    ];

    return (
        <div className="grid grid-cols-2 gap-3 py-6 border-t border-gray-100">
            {badges.map((badge, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-xl border border-transparent hover:border-gray-100 hover:bg-gray-50 transition-all group">
                    <div className={`p-2.5 rounded-full ${badge.color} group-hover:scale-110 transition-transform`}>
                        {badge.icon}
                    </div>
                    <div>
                        <div className="text-sm font-bold text-gray-900 leading-tight">{badge.title}</div>
                        <div className="text-[11px] text-gray-500 font-medium mt-0.5">{badge.desc}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};
