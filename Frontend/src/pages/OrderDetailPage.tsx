import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { OrderService } from '../services/order.service';
import { FiArrowLeft, FiPackage, FiTruck, FiMapPin, FiCreditCard, FiTag, FiCheckCircle, FiClock, FiXCircle, FiFileText } from 'react-icons/fi';
import { Skeleton } from '../components/ui/Skeleton';


interface Order {
    _id: string;
    orderNumber: string;
    createdAt: string;
    status: 'pending_payment' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    subtotal: number;
    discount: number;
    shippingCharges: number;
    total: number;
    couponCode?: string;
    paymentMethod: 'cod' | 'upi' | 'online';
    // ...
    shippingAddress: {
        fullName: string;
        address: string;
        city: string;
        state: string;
        pincode: string;
        phone: string;
    };
    items: {
        product: {
            _id: string;
            name: string;
        };
        name: string;
        image: string;
        quantity: number;
        price: number;
        variant?: { label: string; price: number; sku?: string };
        pack?: { label: string; price: number };
        style?: { label: string; priceAdjustment: number };
        addOns?: { label: string; price: number }[];
        fragrance?: string;
        fragrances?: string[];
        size?: string;
        selectedAttributes?: { [key: string]: string };
        giftCustomization?: {
            occasion: string;
            designId: string;
            message: string;
            price: number;
            active: boolean;
        };
    }[];
}

const getStatusConfig = (status: string) => {
    switch (status) {
        case 'pending_payment': return { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: FiClock, label: 'Payment Pending' };
        case 'pending_verification': return { color: 'bg-orange-50 text-orange-700 border-orange-200', icon: FiClock, label: 'Pending Verification' };
        case 'confirmed': return { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: FiCheckCircle, label: 'Confirmed' };
        case 'processing': return { color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: FiPackage, label: 'Processing' };
        case 'shipped': return { color: 'bg-amber-50 text-amber-700 border-amber-200', icon: FiTruck, label: 'Shipped' };
        case 'delivered': return { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: FiCheckCircle, label: 'Delivered' };
        case 'cancelled': return { color: 'bg-red-50 text-red-700 border-red-200', icon: FiXCircle, label: 'Cancelled' };
        default: return { color: 'bg-gray-50 text-gray-700 border-gray-200', icon: FiClock, label: status };
    }
};

export const OrderDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchOrderDetails(id);
        }
    }, [id]);

    const fetchOrderDetails = async (orderId: string) => {
        try {
            const data = await OrderService.getOrderById(orderId);
            setOrder(data);
        } catch (error) {
            console.error('Failed to fetch order details', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadInvoice = async () => {
        if (!order) return;
        try {
            const data = await OrderService.downloadInvoice(order._id);
            if (data.invoice_url) {
                window.open(data.invoice_url, '_blank');
            } else {
                alert(data.message || "Invoice is being generated. Please try again in 5 minutes.");
            }
        } catch (error: any) {
            console.error('Invoice download failed', error);
            alert(error.response?.data?.message || "Failed to fetch invoice");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FDFBF9] py-12">
                <div className="container mx-auto px-4 max-w-5xl space-y-8">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-12 w-64" />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <Skeleton className="h-[400px] w-full rounded-3xl" />
                        </div>
                        <div className="space-y-6">
                            <Skeleton className="h-[250px] w-full rounded-3xl" />
                            <Skeleton className="h-[250px] w-full rounded-3xl" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FDFBF9]">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
                <Link to="/orders" className="text-primary-600 font-medium hover:text-primary-700 transition-colors">Back to Orders</Link>
            </div>
        );
    }

    const sC = getStatusConfig(order.status);
    const StatusIcon = sC.icon;

    return (
        <div className="min-h-screen bg-[#FDFBF9] py-10 text-gray-800 font-sans">
            <div className="container mx-auto px-4 max-w-5xl">

                {/* Top Nav */}
                <Link to="/orders" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 mb-8 transition-colors group">
                    <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Orders
                </Link>

                {/* Hero Header */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200/60 pb-8">
                    <div className="space-y-2">
                        <p className="text-xs font-black uppercase tracking-widest text-gray-400">Order Overview</p>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                            #{order.orderNumber}
                        </h1>
                        <p className="text-sm font-medium text-gray-500 flex items-center gap-2 mt-2">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className={`px-4 py-2 rounded-full border text-xs font-black uppercase tracking-widest shadow-sm flex items-center gap-2 ${sC.color}`}>
                            <StatusIcon className="w-4 h-4" />
                            {sC.label}
                        </div>
                        {order.status === 'shipped' && (
                            <Link to={`/orders/track/${order._id}`} className="bg-gray-900 text-white px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg hover:bg-black transition-all active:scale-95 flex items-center gap-2">
                                <FiTruck className="w-4 h-4" /> Track
                            </Link>
                        )}
                        {['shipped', 'delivered'].includes(order.status) && (
                            <button 
                                onClick={handleDownloadInvoice}
                                className="bg-white text-gray-900 border-2 border-gray-900 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg hover:bg-gray-50 transition-all active:scale-95 flex items-center gap-2"
                            >
                                <FiFileText className="w-4 h-4" /> Invoice
                            </button>
                        )}
                    </div>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Order Items */}
                        <div className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-gray-100/50 overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/30">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                    <FiPackage className="text-primary-500" /> Items ({order.items.length})
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {order.items.map((item, index) => (
                                    <div key={index} className="p-6 md:p-8 flex flex-col sm:flex-row gap-6">
                                        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-2xl border border-gray-100 flex-shrink-0 p-2 relative group overflow-hidden">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                {item.product?._id ? (
                                                    <Link to={`/product/${item.product._id}`} className="text-lg font-bold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2 leading-tight">
                                                        {item.name}
                                                    </Link>
                                                ) : (
                                                    <p className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight">{item.name}</p>
                                                )}

                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {item.variant && <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded-md text-[11px] font-bold uppercase tracking-wider border border-gray-100">Option: {item.variant.label}</span>}
                                                    {item.size && <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-[11px] font-bold uppercase tracking-wider border border-blue-100">Size: {item.size}</span>}
                                                    {item.pack && <span className="px-2 py-1 bg-green-50 text-green-700 rounded-md text-[11px] font-bold uppercase tracking-wider border border-green-100">Pack: {item.pack.label}</span>}
                                                </div>

                                                <div className="mt-2 text-xs text-gray-500 space-y-1">
                                                    {item.selectedAttributes && !Array.isArray(item.selectedAttributes) && typeof item.selectedAttributes === 'object' && Object.entries(item.selectedAttributes).map(([key, value]) => (
                                                        <p key={key} className="flex gap-2"><span className="font-bold text-gray-400 w-16">{key}:</span> <span>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span></p>
                                                    ))}
                                                    {item.addOns && item.addOns.length > 0 && (
                                                        <p className="flex gap-2"><span className="font-bold text-gray-400 w-16">Extras:</span> <span className="text-purple-600 font-medium">{item.addOns.map(a => a.label).join(', ')}</span></p>
                                                    )}
                                                    {item.fragrance && (
                                                        <p className="flex gap-2"><span className="font-bold text-gray-400 w-16">Fragrance:</span> <span className="text-blue-600 font-medium">{item.fragrance}</span></p>
                                                    )}
                                                </div>

                                                {item.giftCustomization?.active && (
                                                    <div className="mt-4 p-4 bg-[#FAF7F2] rounded-xl border border-[#E5D5C1]/50 relative overflow-hidden group">
                                                        <div className="text-[10px] font-black text-[#8B4513] uppercase tracking-[0.2em] mb-1">
                                                            Gift Personalization
                                                        </div>
                                                        <div className="text-sm font-bold text-gray-900 mb-1">{item.giftCustomization.occasion}</div>
                                                        <p className="text-xs italic text-[#5D4037] leading-relaxed relative z-10">"{item.giftCustomization.message}"</p>
                                                        <FiPackage className="absolute -bottom-2 -right-2 text-5xl text-[#E5D5C1]/30 -rotate-12" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-6 flex justify-between items-end border-t border-gray-100 pt-4">
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Quantity</span>
                                                    <span className="text-sm font-black text-gray-700">{item.quantity}</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Total (Unit: ₹{item.price.toLocaleString()})</span>
                                                    <span className="text-base font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-8">

                        {/* Payment Summary */}
                        <div className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-gray-100/50 p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50/50 rounded-full -mr-16 -mt-16 pointer-events-none" />
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2 relative z-10">
                                <FiCreditCard className="text-primary-500" /> Payment Summary
                            </h3>

                            <div className="space-y-4 text-sm relative z-10">
                                <div className="flex justify-between text-gray-500 font-medium">
                                    <span>Items Subtotal</span>
                                    <span className="text-gray-900 font-bold">₹{order.subtotal?.toLocaleString()}</span>
                                </div>

                                {order.discount > 0 && (
                                    <div className="flex justify-between items-center text-emerald-600 font-bold bg-emerald-50/50 -mx-3 px-3 py-2 rounded-xl border border-emerald-100/50">
                                        <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider">
                                            <FiTag className="w-3 h-3" /> Discount ({order.couponCode})
                                        </span>
                                        <span>-₹{order.discount.toLocaleString()}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-gray-500 font-medium pb-4">
                                    <span>Shipping</span>
                                    <span className={order.shippingCharges === 0 ? "text-emerald-500 font-black uppercase text-[10px] tracking-widest bg-emerald-50 px-2 py-1 rounded-md" : "text-gray-900 font-bold"}>
                                        {order.shippingCharges === 0 ? 'Free Delivery' : `₹${order.shippingCharges.toLocaleString()}`}
                                    </span>
                                </div>

                                <div className="pt-5 border-t border-gray-100 flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Paid</p>
                                        <p className="text-lg font-bold text-gray-900">₹{order.total.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Method</span>
                                        <span className="px-3 py-1 bg-gray-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest">
                                            {order.paymentMethod === 'cod' ? 'COD' : 'Online'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-gray-100/50 p-6">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <FiMapPin className="text-primary-500" /> Delivery
                            </h3>
                            <div className="text-sm text-gray-600 bg-gray-50/50 rounded-2xl p-5 border border-gray-100">
                                <p className="font-bold text-gray-900 text-base mb-1">{order.shippingAddress.fullName}</p>
                                <p className="leading-relaxed mb-3">{order.shippingAddress.address}<br />{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                                <p className="pt-3 border-t border-gray-200/60 font-medium text-gray-900 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                                        <FiTruck className="w-3 h-3" />
                                    </span>
                                    {order.shippingAddress.phone}
                                </p>
                            </div>
                        </div>

                        {/* Support */}
                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl border border-blue-100/50 p-6">
                            <p className="text-xs font-black text-blue-800 uppercase tracking-widest mb-2">Need Assistance?</p>
                            <p className="text-sm text-blue-900/80 mb-5 leading-relaxed font-medium">
                                Have an issue with your order or need tracking updates? We're here to help.
                            </p>
                            <button className="w-full bg-white text-blue-600 border border-blue-200 py-3 rounded-xl text-sm font-bold shadow-sm hover:bg-white/50 transition-all active:scale-[0.98]">
                                Contact Support
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
