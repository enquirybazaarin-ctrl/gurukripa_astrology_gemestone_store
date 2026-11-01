import { createSlice, PayloadAction } from '@reduxjs/toolkit';


export interface CartItem {
  id: string; // Unique ID (productId + attributes hash)
  productId: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  selectedAttributes?: { [key: string]: string }; // Attribute Name -> Option Label
  variantId?: string;
  packId?: string;
  styleId?: string;
  addOnIds?: string[];
  size?: string;
  fragrance?: string;
  fragrances?: string[];
  giftCustomization?: {
    occasion: string;
    designId: string;
    message: string;
    price: number;
    active: boolean;
  };
  breakdown?: {
    basePrice: number;
    attributes: { key: string; value: string }[];
    addOns: string[];
    styles?: string[]; // Added for price breakdown rehydration
    multiplier: number;
  };
  styles?: string[]; // Top level for easy access
}

interface CartState {
  items: CartItem[];
  total: number;
  appliedCoupon: any | null;
  isCartOpen: boolean;
}

const initialState: CartState = {
  items: JSON.parse(localStorage.getItem('cart') || '[]'),
  total: 0,
  appliedCoupon: JSON.parse(localStorage.getItem('appliedCoupon') || 'null'),
  isCartOpen: false,
};

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

// Helper to generate unique ID
const generateCartItemId = (item: Omit<CartItem, 'id'>): string => {
  const parts = [item.productId];

  // Attributes
  if (item.selectedAttributes) {
    const sortedAttrs = Object.entries(item.selectedAttributes)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([key, value]) => `${key}:${value}`)
      .join('|');
    if (sortedAttrs) parts.push(`ATTR[${sortedAttrs}]`);
  }

  // Breakdown (Addons + Multiplier)
  if (item.breakdown) {
    if (item.breakdown.multiplier > 1) parts.push(`PACK[${item.breakdown.multiplier}]`);
    if (item.breakdown.addOns.length > 0) {
      const sortedAddons = [...item.breakdown.addOns].sort().join(',');
      parts.push(`ADDON[${sortedAddons}]`);
    }
  }

  // Styles
  if (item.styles && item.styles.length > 0) {
    const sortedStyles = [...item.styles].sort().join(',');
    parts.push(`STYLES[${sortedStyles}]`);
  }

  // Fragrances
  if (item.fragrances && item.fragrances.length > 0) {
    parts.push(`FRAGS[${item.fragrances.join(',')}]`);
  }

  // Gift Customization
  if (item.giftCustomization?.active) {
    parts.push(`GIFT[${item.giftCustomization.occasion}-${item.giftCustomization.designId}-${item.giftCustomization.message}]`);
  }

  return parts.join('-');
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    ...initialState,
    total: calculateTotal(initialState.items),
  },
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'id'> & { id?: string }>) => {
      const uniqueId = generateCartItemId(action.payload);

      const existingItem = state.items.find((item) => item.id === uniqueId);

      const payloadWithId = { ...action.payload, id: uniqueId };

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(payloadWithId);
      }

      state.total = calculateTotal(state.items);
      localStorage.setItem('cart', JSON.stringify(state.items));
      state.isCartOpen = true;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.total = calculateTotal(state.items);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        state.total = calculateTotal(state.items);
        localStorage.setItem('cart', JSON.stringify(state.items));
      }
    },
    applyCoupon: (state, action: PayloadAction<any>) => {
      state.appliedCoupon = action.payload;
      localStorage.setItem('appliedCoupon', JSON.stringify(action.payload));
    },
    removeCoupon: (state) => {
      state.appliedCoupon = null;
      localStorage.removeItem('appliedCoupon');
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.appliedCoupon = null;
      localStorage.removeItem('cart');
      localStorage.removeItem('appliedCoupon');
    },
    openCart: (state) => {
      state.isCartOpen = true;
    },
    closeCart: (state) => {
      state.isCartOpen = false;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, openCart, closeCart, applyCoupon, removeCoupon } = cartSlice.actions;
export default cartSlice.reducer;
