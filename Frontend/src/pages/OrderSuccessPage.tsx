import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiPhone, FiArrowRight } from 'react-icons/fi';
import confetti from 'canvas-confetti';
import { trackPixelEvent } from '../utils/metaPixel';

export const OrderSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');

    useEffect(() => {
        // Trigger celebration
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });

        if (orderId) {
            trackPixelEvent('Purchase', {
                order_id: orderId,
                currency: 'INR'
            });
        }
    }, [orderId]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="max-w-xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
                {/* Success Icon */}
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping opacity-25"></div>
                        <div className="relative bg-accent text-white p-6 rounded-full shadow-2xl shadow-accent/20">
                            <FiCheckCircle className="w-12 h-12" />
                        </div>
                    </div>
                </div>

                {/* Main Message */}
                <div className="space-y-4">
                    <h1 className="text-4xl font-black text-gray-900">Order Placed Successfully!</h1>
                    <p className="text-xl text-gray-600">
                        Thank you for shopping with us. Your order <span className="text-black font-bold">#{orderId?.slice(-6).toUpperCase()}</span> is being processed.
                    </p>
                </div>

                {/* Manual Verification Info */}
                <div className="bg-accent/5 border border-accent/10 p-6 rounded-2xl text-left space-y-3">
                    <h3 className="flex items-center gap-2 font-bold text-primary-900 uppercase tracking-wider text-xs">
                        <FiPhone className="text-accent" /> What's Next?
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed font-medium">
                        To ensure security and prevent fraud, our team will call you shortly on your provided mobile number to confirm this order.
                        Once verified, we will start preparing your package for shipping!
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Link
                        to="/"
                        className="flex-1 px-8 py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                        Continue Shopping <FiArrowRight />
                    </Link>
                    {orderId && (
                        <Link
                            to={`/orders/${orderId}`}
                            className="flex-1 px-8 py-4 border-2 border-gray-200 text-gray-900 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                        >
                            <FiPackage /> View Order Detail
                        </Link>
                    )}
                </div>

                <p className="text-gray-400 text-sm italic">
                    Note: A confirmation SMS has been sent to your mobile number.
                </p>
            </div>
        </div>
    );
};
