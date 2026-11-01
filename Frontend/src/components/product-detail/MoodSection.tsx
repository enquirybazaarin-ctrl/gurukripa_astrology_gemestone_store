
import { FiMoon, FiSun, FiSmile } from "react-icons/fi";
// Note: In a real app we might map string keys to icons. Here using a helper.

const getIconForMood = (mood: string) => {
    const lower = mood.toLowerCase();
    if (lower.includes('relax') || lower.includes('bed')) return <FiMoon className="w-5 h-5" />;
    if (lower.includes('festive') || lower.includes('party')) return <FiSun className="w-5 h-5" />;
    return <FiSmile className="w-5 h-5" />;
}

interface MoodSectionProps {
    moods: { label: string; icon?: React.ReactNode }[];
    bestFor: string;
}

export const MoodSection = ({ moods, bestFor }: MoodSectionProps) => {
    return (
        <div className="bg-white px-4 py-6 mb-2">
            <h3 className="text-md font-bold text-gray-900 mb-4">Fragrance & Mood</h3>

            <div className="flex gap-4 justify-around mb-6">
                {moods.map((m, i) => (
                    <div key={i} className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 mb-2">
                            {getIconForMood(m.label)}
                        </div>
                        <span className="text-xs font-medium text-gray-700">{m.label}</span>
                    </div>
                ))}
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">Best for: </span>
                    {bestFor}
                </p>
            </div>
        </div>
    );
};
