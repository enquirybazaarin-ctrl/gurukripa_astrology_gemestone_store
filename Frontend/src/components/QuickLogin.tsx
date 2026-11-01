import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import { authService } from '../services/auth.service';

interface QuickLoginProps {
    onSuccess?: () => void;
}

export const QuickLogin = ({ onSuccess }: QuickLoginProps) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !phone) {
            setError('Please fill in all fields');
            return;
        }
        if (phone.length < 10) {
            setError('Please enter a valid phone number');
            return;
        }

        try {
            setLoading(true);
            setError('');
            const response = await authService.identify({ name, phone });

            dispatch(setCredentials({
                user: response.data.user,
                accessToken: response.data.accessToken,
                csrfToken: response.data.csrfToken
            }));

            if (onSuccess) {
                onSuccess();
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Details for Checkout</h3>
            <p className="text-sm text-gray-500 mb-4">Enter your details to proceed.</p>

            <form onSubmit={handleLogin} className="space-y-3">
                <div>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:border-black outline-none"
                    />
                </div>
                <div>
                    <input
                        type="tel"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:border-black outline-none"
                    />
                </div>

                {error && <p className="text-xs text-red-500">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-3 font-bold uppercase text-sm tracking-wide rounded disabled:opacity-50"
                >
                    {loading ? 'Processing...' : 'Proceed to Checkout'}
                </button>
            </form>
        </div>
    );
};
