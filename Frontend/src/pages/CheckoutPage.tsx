import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RootState } from '../store';
import { applyCoupon, removeCoupon, clearCart } from '../store/slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { CouponService } from '../services/coupon.service';
import { FiLock, FiCheck, FiTag, FiX, FiCheckCircle } from 'react-icons/fi';
import { OrderService } from '../services/order.service';
import { AddressSelector } from '../components/AddressSelector';
import { getErrorMessage } from '../utils/errorHandler';
import { toast } from 'react-hot-toast';
import { trackPixelEvent } from '../utils/metaPixel';

// 1. Validation Schema
const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number'),
  address: z.string().min(10, 'Address must be complete'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Invalid Pin Code'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const CheckoutPage = () => {
  const { items, total, appliedCoupon } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('online');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>(undefined);

  // Coupon State
  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  useEffect(() => {
    loadRazorpay();
    if (items.length > 0) {
      trackPixelEvent('InitiateCheckout', {
        num_items: items.length,
        value: total,
        currency: 'INR'
      });
    }
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  const pincode = watch('pincode');

  // Handle Coupon Application
  const handleApplyCoupon = async () => {
    if (!couponInput) return;
    setIsApplyingCoupon(true);
    try {
      const coupon = await CouponService.validateCoupon(couponInput, total);
      dispatch(applyCoupon(coupon));
      toast.success('Coupon applied!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
      dispatch(removeCoupon());
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    setCouponInput('');
  };

  // Pricing Calculation
  const shippingCharges = 0; // Disabled for testing (previously: total > 1000 ? 0 : 50)
  const discountAmount = appliedCoupon ? (
    appliedCoupon.type === 'percentage'
      ? Math.round((total * appliedCoupon.value) / 100)
      : Math.min(appliedCoupon.value, total)
  ) : 0;
  const finalTotal = total + shippingCharges - discountAmount;

  // Auto-Fill from User
  useEffect(() => {
    if (user) {
      if (!selectedAddressId) {
        setValue('fullName', user.name || '');
        setValue('phone', user.phone || '');
        setValue('email', user.email || '');
      }
    }
  }, [user, setValue, selectedAddressId]);

  // Handle Saved Address Selection
  const handleAddressSelect = (address: any) => {
    setSelectedAddressId(address._id);
    setValue('fullName', address.fullName);
    setValue('phone', address.phone);
    setValue('email', address.email || user?.email || '');
    setValue('address', address.address);
    setValue('city', address.city);
    setValue('state', address.state);
    setValue('pincode', address.pincode);
    toast.success('Address applied!');
  };

  // Sticky Logic for Auto-Fill
  useEffect(() => {
    if (pincode?.length === 6 && !selectedAddressId) {
      if (pincode === '400001') {
        setValue('city', 'Mumbai');
        setValue('state', 'Maharashtra');
      } else if (pincode === '110001') {
        setValue('city', 'New Delhi');
        setValue('state', 'Delhi');
      } else if (pincode === '560001') {
        setValue('city', 'Bangalore');
        setValue('state', 'Karnataka');
      }
    }
  }, [pincode, setValue, selectedAddressId]);

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsProcessing(true);
    const toastId = toast.loading('Processing order...');

    try {
      // 1. Create Order
      const { order, token } = await OrderService.createOrder({
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          image: item.image,
          variantId: item.variantId,
          packId: item.packId,
          styleId: item.styleId,
          addOnIds: item.addOnIds,
          size: item.size,
          fragrance: item.fragrance,
          fragrances: item.fragrances,
          giftCustomization: item.giftCustomization,
          selectedAttributes: item.selectedAttributes,
          breakdown: item.breakdown,
          styles: item.styles
        })),
        shippingAddress: {
          fullName: data.fullName,
          phone: data.phone,
          email: data.email || '',
          address: data.address,
          city: data.city,
          state: data.state,
          pincode: data.pincode
        },
        paymentMethod,
        couponCode: appliedCoupon?.code
      });

      // 2. Auto-Login (Guest Checkout)
      // Token is now set in httpOnly cookie by backend, no need to store in localStorage

      // 3. Handle Payment Flow
      if (paymentMethod === 'cod') {
        toast.success(`Order Placed! ID: ${order.orderNumber}`, { id: toastId });
        dispatch(clearCart());
        navigate(`/order-success?orderId=${order._id || order.id}`);
      } else if (order.razorpayOrderId) {

        // Mock Payment Flow
        if (order.razorpayOrderId.startsWith('order_mock_')) {
          toast.loading('Test Mode: Simulating Payment...', { id: toastId });
          setTimeout(async () => {
            try {
              await OrderService.verifyPayment({
                orderId: order._id || (order as any).id,
                paymentId: `pay_mock_${Date.now()}`,
                signature: 'mock_signature',
                razorpayOrderId: order.razorpayOrderId
              });
              toast.success('Payment Successful!', { id: toastId });
              dispatch(clearCart());
              navigate(`/order-success?orderId=${order._id || (order as any).id}`);
            } catch (err) {
              toast.error('Payment Verification Failed', { id: toastId });
              setIsProcessing(false);
            }
          }, 2000);
          return;
        }

        // Open Razorpay
        const options = {
          key: (order as any).razorpayKeyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
          name: "Ecommerce Platform",
          description: "Order Payment",
          order_id: order.razorpayOrderId,
          handler: async function (response: any) {
            try {
              toast.loading('Verifying payment...', { id: toastId });
              await OrderService.verifyPayment({
                orderId: order._id || order.id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                razorpayOrderId: response.razorpay_order_id
              });
              toast.success('Payment Successful!', { id: toastId });
              dispatch(clearCart());
              navigate(`/order-success?orderId=${order._id || (order as any).id}`);
            } catch (err) {
              toast.error('Payment Verification Failed', { id: toastId });
              console.error(err);
            }
          },
          prefill: {
            name: data.fullName,
            email: data.email || '',
            contact: data.phone
          },
          theme: {
            color: "#000000"
          },
          modal: {
            ondismiss: () => {
              toast.error('Payment cancelled', { id: toastId });
              setIsProcessing(false);
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          toast.error("Payment Failed: " + response.error.description, { id: toastId });
          setIsProcessing(false);
        });
        rzp.open();
      }

    } catch (error: any) {
      console.error('Checkout Error:', error);
      toast.error(getErrorMessage(error, 'Failed to place order'), { id: toastId });
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Add some beautiful items to your cart first.</p>
        <Link to="/" className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-medium">
          Browse Products
        </Link>
      </div>
    );
  }

  const PaymentOption = ({ id, label, subtext, icon }: any) => (
    <div
      onClick={() => setPaymentMethod(id)}
      className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 ${paymentMethod === id
        ? 'border-primary-600 bg-red-50 ring-1 ring-primary-600'
        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }`}
    >
      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-4 transition-colors ${paymentMethod === id ? 'border-primary-600 bg-primary-600' : 'border-gray-300'
        }`}>
        {paymentMethod === id && <div className="w-2 h-2 bg-white rounded-full" />}
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className={`font-bold ${paymentMethod === id ? 'text-primary-900' : 'text-gray-900'}`}>
            {label}
          </span>
          {icon && <span className="text-xl">{icon}</span>}
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{subtext}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 pb-28 md:pb-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8 text-sm font-medium text-gray-500">
          <span className="text-primary-600">Cart</span>
          <span className="mx-2">/</span>
          <span className="text-black font-bold">Checkout</span>
          <span className="mx-2">/</span>
          <span>Payment</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT COLUMN: User Details & Payment */}
          <div className="flex-1 space-y-6">

            {/* 1. Contact & Shipping Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-6">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black text-white text-xs">1</span>
                Shipping Details
              </h2>

              <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Full Name</label>
                    <input
                      {...register('fullName')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-1 focus:ring-black focus:border-black outline-none transition-all ${errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'}`}
                      placeholder="e.g. Amit Sharma"
                    />
                    {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Phone Number</label>
                    <input
                      {...register('phone')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-1 focus:ring-black focus:border-black outline-none transition-all ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'}`}
                      placeholder="e.g. 9876543210"
                    />
                    {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Address</label>
                  <textarea
                    {...register('address')}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-1 focus:ring-black focus:border-black outline-none transition-all ${errors.address ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'}`}
                    placeholder="e.g. Flat 101, Crystal Residency, Station Road"
                  />
                  {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Pin Code</label>
                    <input
                      {...register('pincode')}
                      maxLength={6}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-1 focus:ring-black focus:border-black outline-none transition-all ${errors.pincode ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'}`}
                      placeholder="400001"
                    />
                    {errors.pincode && <p className="text-xs text-red-500">{errors.pincode.message}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">City</label>
                    <input
                      {...register('city')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-1 focus:ring-black focus:border-black outline-none transition-all ${errors.city ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'}`}
                      placeholder="Mumbai"
                    />
                    {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">State</label>
                    <input
                      {...register('state')}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-1 focus:ring-black focus:border-black outline-none transition-all ${errors.state ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'}`}
                      placeholder="Maharashtra"
                    />
                    {errors.state && <p className="text-xs text-red-500">{errors.state.message}</p>}
                  </div>
                </div>
              </form>
            </div>

            {/* 2. Payment Method */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-6">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black text-white text-xs">2</span>
                Payment Method
              </h2>

              <div className="space-y-3">
                <PaymentOption
                  id="online"
                  label="Online Payment"
                  subtext="UPI, Credit/Debit Card, Netbanking"
                  icon="💳"
                />
                <PaymentOption
                  id="cod"
                  label="Cash on Delivery"
                  subtext="Pay comfortably at your doorstep"
                  icon="💵"
                />
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Order Summary (Sticky) */}
          <div className="lg:w-96">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4 font-display">Order Summary</h2>

              <div className="max-h-60 overflow-y-auto no-scrollbar space-y-4 mb-4 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 py-3 border-b border-gray-50 last:border-0">
                    <div className="w-14 h-14 bg-gray-50 rounded-md overflow-hidden flex-shrink-0 border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">{item.name}</p>

                      {/* Breakdown Display */}
                      <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                        {item.breakdown ? (
                          <>
                            {item.breakdown.multiplier > 1 && (
                              <span className="block text-green-700 font-bold">Pack of {item.breakdown.multiplier}</span>
                            )}
                            {item.breakdown.attributes.map(attr => (
                              <div key={attr.key} className="flex gap-1">
                                <span className="font-medium">{attr.key}:</span> {attr.value}
                              </div>
                            ))}
                            {item.breakdown.addOns.length > 0 && (
                              <div className="text-purple-700 truncate">
                                + {item.breakdown.addOns.join(', ')}
                              </div>
                            )}
                            {item.fragrances && item.fragrances.length > 0 && (
                              <div className="text-blue-700 italic flex flex-wrap gap-1">
                                <span className="font-medium not-italic">Fragrances:</span> {item.fragrances.join(', ')}
                              </div>
                            )}
                            {item.giftCustomization?.active && (
                              <div className="mt-1 p-2 bg-[#F5EFE8] rounded border border-gray-100 text-[#2A2421]">
                                <div className="text-[10px] font-bold uppercase tracking-wider opacity-60">Gift Personalization</div>
                                <div className="text-xs font-medium">{item.giftCustomization.occasion}</div>
                                <div className="text-[11px] italic mt-0.5">"{item.giftCustomization.message}"</div>
                              </div>
                            )}
                          </>
                        ) : (
                          // Fallback
                          <>
                            {item.selectedAttributes && Object.entries(item.selectedAttributes).map(([k, v]) => (
                              <div key={k}>{k}: {v}</div>
                            ))}
                            {item.fragrances && item.fragrances.length > 0 && (
                              <div className="text-blue-700 italic flex flex-wrap gap-1">
                                <span className="font-medium not-italic">Fragrances:</span> {item.fragrances.join(', ')}
                              </div>
                            )}
                            {item.giftCustomization?.active && (
                              <div className="mt-1 p-2 bg-[#F5EFE8] rounded border border-gray-100 text-[#2A2421]">
                                <div className="text-[10px] font-bold uppercase tracking-wider opacity-60">Gift Personalization</div>
                                <div className="text-xs font-medium">{item.giftCustomization.occasion}</div>
                                <div className="text-[11px] italic mt-0.5">"{item.giftCustomization.message}"</div>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      <p className="text-xs font-semibold text-gray-400 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Section */}
              <div className="mb-6">
                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="PROMO CODE"
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm font-bold focus:ring-1 focus:ring-black outline-none uppercase placeholder:font-medium tracking-widest"
                      />
                    </div>
                    <button
                      onClick={handleApplyCoupon}
                      disabled={!couponInput || isApplyingCoupon}
                      className="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gray-800 disabled:bg-gray-300 transition-colors"
                    >
                      {isApplyingCoupon ? '...' : 'Apply'}
                    </button>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FiCheckCircle className="text-green-600" />
                      <div>
                        <p className="text-[10px] font-bold text-green-800 uppercase tracking-widest">Coupon Applied</p>
                        <p className="text-sm font-black text-green-900 tracking-wider">
                          {appliedCoupon.code} <span className="font-medium text-xs ml-1">(-₹{discountAmount})</span>
                        </p>
                      </div>
                    </div>
                    <button onClick={handleRemoveCoupon} className="p-1 hover:bg-green-100 rounded-full text-green-800 transition-colors">
                      <FiX size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sm text-green-600 font-bold">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  {shippingCharges === 0 ? (
                    <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded text-xs tracking-wide">FREE</span>
                  ) : (
                    <span>₹{shippingCharges}</span>
                  )}
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-dashed">
                  <span>Total</span>
                  <span>₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={isProcessing}
                className="w-full bg-black hover:bg-gray-800 text-white py-4 rounded-xl font-bold shadow-lg shadow-gray-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
              >
                {isProcessing ? 'Processing...' : (
                  <>
                    <FiLock className="w-4 h-4" />
                    Place Order {paymentMethod === 'cod' ? '(COD)' : ''}
                  </>
                )}
              </button>

              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <FiLock className="w-3 h-3" />
                  <span className="text-[10px] font-medium uppercase tracking-wider">256-Bit SSL Secured</span>
                </div>
                <div className="flex items-center justify-center gap-4 opacity-50 grayscale">
                  <span className="text-[10px] font-bold border px-1 rounded">VISA</span>
                  <span className="text-[10px] font-bold border px-1 rounded">Mastercard</span>
                  <span className="text-[10px] font-bold border px-1 rounded">UPI</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
