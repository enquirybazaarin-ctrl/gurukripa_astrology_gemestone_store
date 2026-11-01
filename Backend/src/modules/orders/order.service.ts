import mongoose from 'mongoose';
import { Order, IOrder } from './order.model';
import { CustomError } from '../../common/middleware/errorHandler';
import { paymentService } from './payment.service';

export class OrderService {
  async createOrder(userId: string | undefined, orderData: any, ipAddress?: string): Promise<IOrder> {
    const { items, shippingAddress, paymentMethod } = orderData;

    // 1. Validate Items & Calculate Total
    let subtotal = 0;
    const orderItems = [];

    // Import Universal Pricing Engine
    const { calculateFinalPrice } = await import('../../common/utils/pricingEngine');

    for (const item of items) {
      const product = await mongoose.model('Product').findById(item.productId).lean() as any;
      if (!product) {
        throw new CustomError(`Product not found: ${item.name}`, 404);
      }
      if (product.stock < item.quantity) {
        throw new CustomError(`Insufficient stock for: ${product.name}`, 400);
      }

      // UNIVERSAL PRICING VERIFICATION (Strict Server-Side)
      const pricingResult = calculateFinalPrice(product, {
        variantId: item.variantId,
        packId: item.packId,
        styleId: item.styleId,
        addOnIds: item.addOnIds
      });

      const verifiedPrice = pricingResult.finalPrice;

      // Extract Snapshots for Order History
      const variantSnapshot = item.variantId && product.variants ?
        product.variants.find((v: any) => v.id === item.variantId || v._id.toString() === item.variantId) : null;

      const packSnapshot = item.packId ? (
        variantSnapshot?.packs?.find((p: any) => p.id === item.packId || p._id.toString() === item.packId) ||
        product.packs?.find((p: any) => p.id === item.packId || p._id.toString() === item.packId)
      ) : null;

      const styleSnapshot = item.styleId && product.styles ?
        product.styles.find((s: any) => s.id === item.styleId || s._id.toString() === item.styleId) : null;

      const addOnsSnapshot = item.addOnIds && product.addOns ?
        product.addOns.filter((a: any) => item.addOnIds.includes(a.id) || item.addOnIds.includes(a._id.toString())) : [];

      subtotal += verifiedPrice * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: variantSnapshot?.image || product.images[0], // Use variant image if available
        price: verifiedPrice,
        originalPrice: pricingResult.basePrice || product.originalPrice,
        quantity: item.quantity,

        // New Universal Snapshots
        variant: variantSnapshot ? {
          id: variantSnapshot._id?.toString(),
          label: variantSnapshot.label,
          price: variantSnapshot.price,
          sku: variantSnapshot.sku
        } : undefined,

        pack: packSnapshot ? {
          id: packSnapshot._id?.toString(),
          label: packSnapshot.label,
          price: packSnapshot.price || verifiedPrice // Pack usually implies the price used
        } : undefined,

        style: styleSnapshot ? {
          id: styleSnapshot._id?.toString(),
          label: styleSnapshot.label,
          priceAdjustment: styleSnapshot.priceAdjustment
        } : undefined,

        addOns: addOnsSnapshot.map((a: any) => ({
          id: a._id?.toString(),
          label: a.label || a.name,
          price: a.price
        })),

        // NEW: Customization Snapshots
        fragrance: item.fragrance,
        fragrances: item.fragrances,
        giftCustomization: item.giftCustomization,
        size: item.size,
        selectedAttributes: item.selectedAttributes
      });
    }

    const shippingCharges = 0; // Disabled for testing (previously: subtotal > 1000 ? 0 : 50)
    let total = subtotal + shippingCharges;
    let discount = 0;
    let appliedCoupon = null;

    // 1.1 Handle Coupon Logic
    if (orderData.couponCode) {
      const { couponService } = await import('../coupons/coupon.service');
      appliedCoupon = await couponService.validateCoupon(orderData.couponCode, subtotal);

      if (appliedCoupon.type === 'percentage') {
        discount = Math.round((subtotal * appliedCoupon.value) / 100);
      } else {
        discount = appliedCoupon.value;
      }

      // Ensure discount doesn't exceed subtotal
      discount = Math.min(discount, subtotal);
      total -= discount;
    }

    // Generate Order Number explicitly
    const count = await Order.countDocuments();
    const orderNumber = `ORD${Date.now()}${String(count + 1).padStart(4, '0')}`;

    // Ensure Shipping Address & Contact
    const finalShippingAddress = {
      ...shippingAddress,
      name: shippingAddress.name || shippingAddress.fullName,
      email: shippingAddress.email
    };

    // 2. Create Order in DB (Pending Payment)
    const order = new Order({
      orderNumber,
      user: userId ? new mongoose.Types.ObjectId(userId) : undefined,
      items: orderItems,
      shippingAddress: finalShippingAddress,
      paymentMethod,
      subtotal,
      discount,
      couponCode: appliedCoupon?.code,
      shippingCharges,
      total,
      status: 'pending_payment',
      paymentStatus: 'pending',
      ipAddress,
      isVerified: false
    });

    await order.save();

    // Increment Coupon Usage if applicable
    if (appliedCoupon) {
      const { couponService } = await import('../coupons/coupon.service');
      await couponService.updateCoupon(appliedCoupon._id.toString(), {
        $inc: { usedCount: 1 }
      });
    }

    // 3. Handle Razorpay
    if (paymentMethod === 'online' || paymentMethod === 'upi') {
      const razorpayOrder = await paymentService.createRazorpayOrder(total, order.orderNumber);

      order.razorpayOrderId = razorpayOrder.id;
      await order.save();

      return {
        ...order.toObject(),
        razorpayOrderId: razorpayOrder.id,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID
      } as any;
    }

    // For COD, set to pending_verification immediately
    if (paymentMethod === 'cod') {
      order.status = 'pending_verification';
      await order.save();
    }

    return order;
  }

  async verifyPayment(orderId: string, paymentId: string, signature: string, razorpayOrderId: string): Promise<IOrder> {
    const order = await Order.findById(orderId);
    if (!order) throw new CustomError('Order not found', 404);

    const isValid = paymentService.verifyPaymentSignature(razorpayOrderId, paymentId, signature);

    if (isValid) {
      order.paymentStatus = 'verified';
      order.status = 'pending_verification'; // After payment, it goes to verification
      order.razorpayPaymentId = paymentId;
      order.razorpaySignature = signature;
      await order.save();

      // Update Stock (Optional: Do this after manual verification? Usually after payment is fine)
      for (const item of order.items) {
        await mongoose.model('Product').findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity }
        });
      }

      return order;
    } else {
      order.paymentStatus = 'failed';
      await order.save();
      throw new CustomError('Invalid Payment Signature', 400);
    }
  }

  // --- Verification Logic ---
  async manualVerifyOrder(orderId: string, adminId: string, isVerified: boolean): Promise<IOrder> {
    const order = await Order.findById(orderId);
    if (!order) throw new CustomError('Order not found', 404);

    if (isVerified) {
      order.isVerified = true;
      order.verifiedAt = new Date();
      order.verifiedBy = new mongoose.Types.ObjectId(adminId);
      order.status = 'confirmed';
    } else {
      order.status = 'cancelled';
      order.notes = (order.notes || '') + '\nCancelled during manual verification call.';
    }

    await order.save();
    return order;
  }

  async getUserOrders(userId: string, phone?: string): Promise<IOrder[]> {
    const query: any = {
      $or: [
        { user: userId }
      ]
    };

    if (phone) {
      query.$or.push({ 'shippingAddress.phone': phone });
    }

    return Order.find(query)
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 })
      .lean() as unknown as IOrder[];
  }


  async getOrderById(orderId: string, userId?: string, phone?: string): Promise<IOrder> {
    const query: any = { _id: orderId };
    if (userId) {
      query.$or = [
        { user: userId }
      ];
      if (phone) {
        query.$or.push({ 'shippingAddress.phone': phone });
      }
    }

    const order = await Order.findOne(query)
      .populate('items.product', 'name image') // Start with items.product population
      .populate('user', 'name email phone') // Also populate user for admin view if needed
      .lean();

    if (!order) {
      throw new CustomError('Order not found', 404);
    }

    return order as unknown as IOrder;
  }

  async cancelOrder(orderId: string, userId: string): Promise<IOrder> {
    const order = await Order.findOne({ _id: orderId, user: userId });

    if (!order) {
      throw new CustomError('Order not found', 404);
    }

    if (['shipped', 'delivered'].includes(order.status)) {
      throw new CustomError('Cannot cancel order that is already shipped', 400);
    }

    order.status = 'cancelled';
    await order.save();

    return order;
  }

  // --- Admin Methods ---

  async getAllOrders(page: number = 1, limit: number = 20): Promise<{ orders: IOrder[]; total: number; pages: number }> {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find()
        .populate('user', 'name email phone') // Populate user details
        .populate('items.product', 'name image')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean() as unknown as Promise<IOrder[]>,
      Order.countDocuments()
    ]);

    return {
      orders,
      total,
      pages: Math.ceil(total / limit)
    };
  }

  async updateOrderStatus(orderId: string, status: string): Promise<IOrder> {
    const order = await Order.findById(orderId);
    if (!order) throw new CustomError('Order not found', 404);

    order.status = status as any; // Cast validation handled by mongoose enum
    if (status === 'delivered') {
      order.paymentStatus = 'verified'; // Assume COD delivered = paid, or online already paid
    }

    await order.save();
    return order;
  }

  async updateShippingDetails(orderId: string, shippingData: Partial<{ 
    courierName: string; 
    awbNumber: string; 
    trackingUrl: string; 
    packageWeight: number;
    shiprocketOrderId: number;
    shiprocketShipmentId: number;
    status: string;
  }>): Promise<IOrder> {
    const order = await Order.findById(orderId);
    if (!order) throw new CustomError('Order not found', 404);

    if (shippingData.courierName !== undefined) order.courierName = shippingData.courierName;
    if (shippingData.awbNumber !== undefined) order.awbNumber = shippingData.awbNumber;
    if (shippingData.status !== undefined) order.status = shippingData.status as any;
    if (shippingData.trackingUrl !== undefined) order.trackingUrl = shippingData.trackingUrl;
    if (shippingData.packageWeight !== undefined) order.packageWeight = shippingData.packageWeight;
    if (shippingData.shiprocketOrderId !== undefined) {
      console.log('Setting Shiprocket Order ID:', shippingData.shiprocketOrderId);
      order.set('shiprocketOrderId', shippingData.shiprocketOrderId);
    }
    if (shippingData.shiprocketShipmentId !== undefined) {
      console.log('Setting Shiprocket Shipment ID:', shippingData.shiprocketShipmentId);
      order.set('shiprocketShipmentId', shippingData.shiprocketShipmentId);
    }

    await order.save();
    console.log('Order saved successfully');
    return order;
  }

  async deleteOrder(orderId: string): Promise<void> {
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      throw new CustomError('Order not found', 404);
    }
  }

  async addTrackingHistory(orderId: string, event: { status: string; activity: string; location: string; timestamp?: Date }, newStatus?: string): Promise<void> {
    const order = await Order.findById(orderId);
    if (!order) return;

    if (!order.trackingHistory) order.trackingHistory = [];
    
    order.trackingHistory.push({
      status: event.status,
      activity: event.activity,
      location: event.location,
      timestamp: event.timestamp || new Date()
    });

    if (newStatus) {
      order.status = newStatus as any;
    }

    await order.save();
  }
}

export const orderService = new OrderService();
