import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiChevronLeft, FiPackage, FiTruck, FiCheckCircle, FiBox, FiMapPin, FiClock } from 'react-icons/fi';
import { OrderService } from '../services/order.service';
import { OrderSkeleton } from '../components/skeletons/OrderSkeleton';

export const OrderTrackingPage = () => {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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
            console.error("Failed to load tracking details", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-6"></div>
                    <OrderSkeleton />
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
                <FiPackage className="text-6xl text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold">Order Not Found</h2>
                <Link to="/orders" className="text-primary-600 mt-4 hover:underline">Return to Orders</Link>
            </div>
        );
    }

    // Define tracking steps conceptually based on typical Shiprocket flows
    const steps = [
        { key: 'placed', label: 'Order Placed', icon: FiBox, date: new Date(order.createdAt).toLocaleString() },
        { key: 'packed', label: 'Packed & Ready', icon: FiPackage, date: order.shipmentStatus === 'Unshipped' ? 'Pending' : 'Completed' },
        { key: 'shipped', label: 'Shipped', icon: FiTruck, date: order.shipmentStatus === 'Shipped' || order.shipmentStatus === 'Delivered' ? 'Completed' : 'Pending' },
        { key: 'out_for_delivery', label: 'Out for Delivery', icon: FiMapPin, date: order.status === 'Delivered' ? 'Completed' : 'Pending' },
        { key: 'delivered', label: 'Delivered', icon: FiCheckCircle, date: order.status === 'Delivered' ? 'Completed' : 'Pending' },
    ];

    // Map order status to progress index
    let currentStepIndex = 0;
    if (order.status === 'Delivered') currentStepIndex = 4;
    else if (order.shipmentStatus === 'Shipped') currentStepIndex = 2;
    else if (order.awbNumber) currentStepIndex = 1;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <Link to="/orders" className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6 w-fit">
                    <FiChevronLeft className="mr-1" /> Back to Orders
                </Link>

                {/* Header Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Track Order</h1>
                            <p className="text-gray-500 mt-1">Order #{order.orderNumber}</p>
                        </div>

                        {order.awbNumber && (
                            <div className="flex items-center gap-4 bg-primary-50 p-4 rounded-xl border border-primary-100">
                                <div className="p-3 bg-white rounded-full text-primary-600 shadow-sm">
                                    <FiTruck className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{order.courier}</p>
                                    <p className="text-xs text-primary-700 font-mono font-medium tracking-wide">AWB: {order.awbNumber}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Timeline Tracking */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                            <h3 className="font-bold text-gray-900 mb-8 border-b pb-4">Tracking History</h3>

                            {order.trackingHistory && order.trackingHistory.length > 0 ? (
                                <div className="relative pl-8 space-y-12">
                                    {/* Vertical line connecting nodes */}
                                    <div className="absolute left-[39px] top-6 bottom-6 w-0.5 bg-gray-200"></div>

                                    {order.trackingHistory.map((event: any, index: number) => {
                                        const isLatest = index === order.trackingHistory.length - 1;
                                        return (
                                            <div key={index} className="relative flex gap-6">
                                                {/* Timeline Node */}
                                                <div className={`absolute -left-[56px] top-0 w-12 h-12 rounded-full border-[3px] flex items-center justify-center bg-white z-10 transition-colors duration-500
                                                    ${isLatest ? 'border-primary-500 text-primary-600 ring-4 ring-primary-100' : 'border-gray-200 text-gray-400'}
                                                `}>
                                                    {isLatest ? <FiTruck className="w-5 h-5" /> : <FiCheckCircle className="w-5 h-5" />}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className={`text-lg font-bold ${isLatest ? 'text-gray-900' : 'text-gray-500'}`}>
                                                            {event.status}
                                                        </h4>
                                                        <span className="text-[10px] font-bold text-gray-400 font-mono">
                                                            {new Date(event.timestamp).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <p className={`text-sm mt-1 ${isLatest ? 'text-gray-600' : 'text-gray-400'}`}>
                                                        {event.activity}
                                                    </p>
                                                    {event.location && (
                                                        <p className="text-xs font-bold text-primary-600 mt-2 flex items-center gap-1 uppercase tracking-wider">
                                                            <FiMapPin className="w-3 h-3" /> {event.location}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    }).reverse()}
                                </div>
                            ) : (
                                <div className="relative pl-8 space-y-12">
                                    {/* Vertical line connecting nodes */}
                                    <div className="absolute left-[39px] top-6 bottom-6 w-0.5 bg-gray-200"></div>

                                    {steps.map((step, index) => {
                                        const isCompleted = index <= currentStepIndex;
                                        const isCurrent = index === currentStepIndex;
                                        const StepIcon = step.icon;
                                        return (
                                            <div key={step.key} className={`relative flex gap-6 ${isCompleted ? 'opacity-100' : 'opacity-40'}`}>
                                                {/* Timeline Node */}
                                                <div className={`absolute -left-[56px] top-0 w-12 h-12 rounded-full border-[3px] flex items-center justify-center bg-white z-10 transition-colors duration-500
                                ${isCompleted ? 'border-primary-500 text-primary-600' : 'border-gray-200 text-gray-400'}
                                ${isCurrent ? 'ring-4 ring-primary-100' : ''}
                            `}>
                                                    <StepIcon className="w-5 h-5" />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1">
                                                    <h4 className={`text-lg font-bold ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                                                        {step.label}
                                                    </h4>
                                                    <p className={`text-sm mt-1 flex items-center gap-1.5 ${isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                                                        <FiClock className="w-3.5 h-3.5" />
                                                        {step.date}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-900 mb-4 border-b pb-3">Delivery Address</h3>
                            <div className="text-sm text-gray-600 leading-relaxed space-y-1">
                                <p className="font-bold text-gray-900 text-base">{order.shippingAddress?.name || order.customer?.name}</p>
                                <p className="mt-2 text-gray-800">{order.shippingAddress?.phone}</p>
                                <p className="mt-2">{order.shippingAddress?.address}</p>
                                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                                <p className="font-bold text-gray-900 mt-2">PIN: {order.shippingAddress?.pincode}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-900 mb-4 border-b pb-3">Need Help?</h3>
                            <p className="text-sm text-gray-500 mb-4">Have an issue with this order? Contact our support team.</p>
                            <button className="w-full py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition text-sm">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
