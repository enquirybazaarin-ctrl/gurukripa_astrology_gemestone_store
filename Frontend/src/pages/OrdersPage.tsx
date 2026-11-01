import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { OrderService } from '../services/order.service';
import { FiPackage, FiChevronRight, FiClock, FiCheckCircle, FiTruck, FiXCircle, FiDownload, FiMapPin } from 'react-icons/fi';
import { OrderSkeleton } from '../components/skeletons/OrderSkeleton';


interface OrderItem {
  product: {
    _id: string;
    name: string;
    images: string[];
    slug: string;
  };
  quantity: number;
  price: number;
  image: string;
  name: string;
  variant?: { label: string };
  pack?: { label: string };
  style?: { label: string };
  fragrance?: string;
  fragrances?: string[];
  size?: string;
  selectedAttributes?: { [key: string]: string };
}

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  status: 'pending_payment' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  shipmentStatus?: string;
  courier?: string;
  awbNumber?: string;
}

const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
  pending_payment: { color: 'bg-yellow-100 text-yellow-800', icon: FiClock, label: 'Payment Pending' },
  confirmed: { color: 'bg-blue-100 text-blue-800', icon: FiCheckCircle, label: 'Confirmed' },
  processing: { color: 'bg-blue-100 text-blue-800', icon: FiPackage, label: 'Processing' },
  shipped: { color: 'bg-purple-100 text-purple-800', icon: FiTruck, label: 'Shipped' },
  delivered: { color: 'bg-green-100 text-green-800', icon: FiCheckCircle, label: 'Delivered' },
  cancelled: { color: 'bg-red-100 text-red-800', icon: FiXCircle, label: 'Cancelled' },
};

export const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await OrderService.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-8"></div>
          {[...Array(3)].map((_, i) => (
            <OrderSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiPackage className="text-4xl text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Looks like you haven't placed any orders yet. Start shopping to fill your wardrobe with amazing styles!
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pb-28 md:pb-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => {
            const statusInfo = statusConfig[order.status] || { color: 'bg-gray-100 text-gray-800', icon: FiClock, label: order.status };
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center">
                  <div className="flex gap-6 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Order Placed</p>
                      <p className="font-medium text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Total Amount</p>
                      <p className="font-medium text-gray-900">₹{order.total.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Order #</p>
                      <p className="font-medium text-gray-900 font-mono">{order.orderNumber}</p>
                    </div>
                  </div>

                  <Link
                    to={`/orders/${order._id}`}
                    className="flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm gap-1 group"
                  >
                    View Details
                    <FiChevronRight className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>

                {/* Body */}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Status Badge & Shipping Info */}
                    <div className="md:w-64 flex-shrink-0 border-r pr-6 border-gray-100">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusInfo.label}
                      </div>

                      {order.awbNumber && (
                        <div className="mt-4 bg-blue-50/50 rounded-lg p-3 border border-blue-100">
                          <p className="text-xs font-bold text-gray-900 mb-1 flex items-center gap-1.5">
                            <FiTruck className="text-blue-600" /> {order.courier}
                          </p>
                          <p className="text-xs text-gray-600 font-mono">AWB: {order.awbNumber}</p>
                          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wide font-medium">Status: {order.shipmentStatus}</p>
                        </div>
                      )}

                      <div className="mt-4 space-y-2">
                        {order.awbNumber && (
                          <Link to={`/tracking/${order._id}`} className="w-full bg-primary-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-primary-700 transition flex items-center justify-center gap-1.5">
                            <FiMapPin /> Track Order
                          </Link>
                        )}
                        <button className="w-full bg-white border border-gray-200 text-gray-700 text-xs font-bold py-2 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-1.5 shadow-sm">
                          <FiDownload /> Download Invoice
                        </button>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="flex-1 space-y-4">
                      {order.items.slice(0, 2).map((item, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="w-16 h-16 bg-gray-50 rounded-lg border border-gray-100 flex-shrink-0 overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 line-clamp-1">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                              {(item.variant || item.pack || item.style || item.size || item.selectedAttributes || item.fragrance || (item.fragrances && item.fragrances.length > 0)) && (
                                <span className="block mt-0.5 font-medium text-gray-700">
                                  {item.variant?.label}
                                  {item.variant && item.pack ? ' • ' : ''}
                                  {item.pack?.label}
                                  {(item.variant || item.pack) && item.size ? ' • ' : ''}
                                  {item.size}
                                  {(item.variant || item.pack || item.size) && item.selectedAttributes ? ' • ' : ''}
                                  {item.selectedAttributes && !Array.isArray(item.selectedAttributes) && typeof item.selectedAttributes === 'object' ? Object.values(item.selectedAttributes).join(', ') : ''}
                                  {item.selectedAttributes && Array.isArray(item.selectedAttributes) && item.selectedAttributes.map(a => typeof a === 'object' ? Object.values(a).join(', ') : String(a)).join(', ')}
                                  {(item.variant || item.pack || item.size || item.selectedAttributes) && item.style ? ' • ' : ''}
                                  {item.style?.label}
                                  {(item.variant || item.pack || item.size || item.selectedAttributes || item.style) && (item.fragrance || (item.fragrances && item.fragrances.length > 0)) ? ' • ' : ''}
                                  {item.fragrance || (item.fragrances && item.fragrances.length > 0 ? `${item.fragrances.length} Fragrances` : '')}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-xs text-gray-500 pt-2">
                          + {order.items.length - 2} more items
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
