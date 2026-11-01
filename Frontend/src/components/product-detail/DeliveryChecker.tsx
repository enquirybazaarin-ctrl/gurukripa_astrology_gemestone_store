import { useState } from 'react';
import { FiMapPin, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export const DeliveryChecker = () => {
    const [pincode, setPincode] = useState('');
    const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
    const [message, setMessage] = useState('');

    const handleCheck = () => {
        if (!pincode || pincode.length !== 6) {
            setMessage('Please enter a valid 6-digit pincode');
            setStatus('unavailable');
            return;
        }

        setStatus('checking');

        // Mock API call simulation
        setTimeout(() => {
            // Mock logic: Pincodes starting with 1, 2, 4 are available
            if (['1', '2', '4'].includes(pincode[0])) {
                setStatus('available');
                setMessage('Delivery available by ' + new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toDateString());
            } else {
                setStatus('unavailable');
                setMessage('Sorry, delivery not available to this location yet.');
            }
        }, 1000);
    };

    return (
        <div className="bg-gray-50 p-4 rounded-lg mt-4">
            <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <FiMapPin /> Delivery & Services
            </h3>
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Enter Pincode"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setPincode(val);
                        setStatus('idle');
                        setMessage('');
                    }}
                    className="flex-1 border text-sm rounded px-3 py-2 focus:outline-none focus:border-primary-600"
                />
                <button
                    onClick={handleCheck}
                    disabled={status === 'checking'}
                    className="text-primary-600 font-medium text-sm hover:underline disabled:opacity-50"
                >
                    {status === 'checking' ? 'Checking...' : 'Check'}
                </button>
            </div>
            {message && (
                <div className={`text-xs mt-2 flex items-center gap-1 ${status === 'available' ? 'text-green-600' : 'text-red-500'}`}>
                    {status === 'available' ? <FiCheckCircle /> : <FiXCircle />}
                    {message}
                </div>
            )}
            <div className="mt-3 text-xs text-gray-500 space-y-1">
                <p>✓ Cash on Delivery available</p>
                <p>✓ Easy 7-day returns & exchange</p>
            </div>
        </div>
    );
};
