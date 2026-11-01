
import { FiHome, FiGift, FiSun, FiHeart } from "react-icons/fi";

const getUsageIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes('home')) return <FiHome />;
    if (l.includes('gift')) return <FiGift />;
    if (l.includes('meditation') || l.includes('pooja')) return <FiSun />;
    return <FiHeart />;
}

interface UsageScenario {
    label: string;
}

export const UsageScenarios = ({ scenarios }: { scenarios: UsageScenario[] }) => {
    return (
        <div className="bg-white px-4 py-6 mb-2">
            <h3 className="text-md font-bold text-gray-900 mb-4">Perfect For</h3>
            <div className="grid grid-cols-2 gap-3">
                {scenarios.map((s, i) => (
                    <div key={i} className="flex items-center p-3 border border-gray-100 rounded-lg bg-gray-50/50">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-700 shadow-sm mr-3">
                            {getUsageIcon(s.label)}
                        </div>
                        <span className="text-sm font-medium text-gray-800">{s.label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
