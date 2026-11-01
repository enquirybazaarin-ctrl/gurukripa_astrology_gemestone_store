import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { toast } from 'react-hot-toast';
import { calculateFinalPrice } from '../utils/pricingEngine';
import { trackPixelEvent } from '../utils/metaPixel';

import { FiShoppingBag } from 'react-icons/fi';
import { SEO } from '../components/SEO';
import { ImageGallery } from '../components/product-detail/ImageGallery';
import { PricingBlock } from '../components/product-detail/PricingBlock';
import { RatingsSummary } from '../components/product-detail/RatingsSummary';
import { SizeSelector } from '../components/product-detail/SizeSelector';
import { PackSelector } from '../components/product-detail/PackSelector';
import { VariantSelector } from '../components/product-detail/VariantSelector';
import { ProductDescription } from '../components/product-detail/ProductDescription';
import { ReviewsSection } from '../components/product-detail/ReviewsSection';
import { FAQSection } from '../components/product-detail/FAQSection';
import { RelatedProducts } from '../components/product-detail/RelatedProducts';
import { StickyBottomBar } from '../components/product-detail/StickyBottomBar';
import { FragranceSelector } from '../components/product-detail/FragranceSelector';
import { GiftCustomization, GiftOccasion } from '../components/product-detail/GiftCustomization';
import { ProductSpecifications } from '../components/product-detail/ProductSpecifications';
import { api } from '../services/api';
import { ProductDetailSkeleton } from '../components/skeletons/ProductDetailSkeleton';

interface Product {
  _id: string;
  name: string;
  description: string;
  shortDescription?: string;
  images: string[];
  price: number;
  originalPrice?: number;
  stock: number;
  rating: number;
  totalReviews: number;
  category: { _id: string; name: string; slug: string };

  // Specs
  material?: string;
  finish?: string;
  capacity?: number;
  weight?: number;
  dimensions?: {
    height?: number;
    width?: number;
    length?: number;
    weight?: number;
  };
  specifications?: Array<{ key: string; value: string }>;

  // Universal Product Model
  variants?: Array<{
    _id: string;
    label: string;
    sku?: string;
    price: number;
    originalPrice?: number;
    stock: number;
    image?: string;
    isDefault?: boolean;
    packs?: Array<{
      _id: string;
      label: string;
      quantity: number;
      price: number;
      originalPrice?: number;
      isDefault?: boolean;
    }>;
  }>;
  sortOrder?: number;
  pdpLayout?: string[];

  styles?: Array<{
    _id: string;
    label: string;
    priceAdjustment: number;
    image?: string;
  }>;

  colors?: Array<{
    _id: string;
    label: string;
    hex: string;
    image?: string;
  }>;

  addOns?: Array<{
    _id: string;
    label: string;
    price: number;
    description?: string;
    required?: boolean;
  }>;

  // Legacy (Support fallback if needed)
  sizes?: Array<{ name: string; price: number }>;
  fragrances?: string[];
  packs?: Array<{
    label: string;
    quantity: number;
    pricingType: 'auto' | 'discount' | 'fixed';
    fixedPrice?: number;
    discountPercent?: number;
  }>;
  faqs?: Array<{ question: string; answer: string }>;
  allowMixedFragrance?: boolean;
  giftOptions?: {
    active: boolean;
    price: number;
    occasions: Array<{
      id: string;
      label: string;
      designs: Array<{ id: string; image: string }>;
    }>;
  };
}

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Product state
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Universal Selection State
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [selectedPackId, setSelectedPackId] = useState<string | null>(null);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<{ label: string; hex: string; image?: string } | null>(null);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);

  // Legacy State (Keep for now or map to new)
  const [selectedSize, setSelectedSize] = useState<{ name: string; price: number } | null>(null);
  const [selectedFragrance, setSelectedFragrance] = useState<string>('');
  const [selectedFragrances, setSelectedFragrances] = useState<string[]>([]);
  const [giftCustomization, setGiftCustomization] = useState({
    occasion: '',
    designId: '',
    message: '',
    active: false,
    price: 49
  });

  // UI state
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Fetch product
  useEffect(() => {
    // Reset all selection state when navigating to a new product
    setSelectedVariantId(null);
    setSelectedPackId(null);
    setSelectedStyleId(null);
    setSelectedColor(null);
    setSelectedAddOnIds([]);
    setSelectedSize(null);
    setSelectedFragrance('');
    setSelectedFragrances([]);
    setGiftCustomization({
      occasion: '',
      designId: '',
      message: '',
      active: false,
      price: 49
    });
    setShowFullDescription(false);

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);
        const data = response.data;

        if (data.success) {
          const fetchedProduct = data.data.product;
          setProduct(fetchedProduct);
          trackPixelEvent('ViewContent', {
            content_name: fetchedProduct.name,
            content_ids: [fetchedProduct._id],
            content_type: 'product',
            value: fetchedProduct.price,
            currency: 'INR'
          });
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Pricing Engine Calculation
  const pricingResult = product ? (() => {
    const calc = calculateFinalPrice(product, {
      variantId: selectedVariantId || undefined,
      packId: selectedPackId || undefined,
      styleId: selectedStyleId || undefined,
      addOnIds: selectedAddOnIds,
      quantity: 1
    });

    // Add gift personalization price if active (post-calculation)
    if (giftCustomization.active) {
      calc.finalPrice += giftCustomization.price;
      calc.basePrice += giftCustomization.price;

      calc.discountAmount = Math.max(0, calc.basePrice - calc.finalPrice);
      calc.discountPercent = calc.basePrice > 0 ? Math.round((calc.discountAmount / calc.basePrice) * 100) : 0;
    }

    return calc;
  })() : { finalPrice: 0, basePrice: 0, discountAmount: 0, discountPercent: 0, breakdown: { base: 0, packAdjustment: 0, styleAdjustment: 0, addOnsTotal: 0 } };

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (!product) return;

    let selectedVariant = null;

    // Validation: Require Variant/Size selection if available
    if (product.variants && product.variants.length > 0) {
      if (!selectedVariantId) {
        toast.error('Please select an option (Size/Color)');
        return;
      }
      // Check stock for selected variant
      selectedVariant = product.variants.find(v => v._id === selectedVariantId);
      if (selectedVariant && selectedVariant.stock === 0) {
        toast.error('Selected variant is out of stock');
        return;
      }
    }

    // Validation: Legacy Size
    else if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    // Fragrance validation (Legacy support)
    if (product.fragrances && product.fragrances.length > 0) {
      if (product.allowMixedFragrance) {
        const activePack = product.variants?.find(v => v._id === selectedVariantId)?.packs?.find(p => p._id === selectedPackId)
          || product.packs?.find((p: any) => p._id === selectedPackId || p.id === selectedPackId);

        const requiredCount = (activePack as any)?.quantity || 1;
        if (selectedFragrances.length < requiredCount || selectedFragrances.some(f => !f)) {
          toast.error(`Please select all ${requiredCount} fragrances`);
          return;
        }
      } else if (!selectedFragrance) {
        toast.error('Please select a fragrance');
        return;
      }
    }

    // Construct a descriptive name for the cart item
    let itemName = product.name;
    const descriptions = [];
    if (selectedVariant) descriptions.push(selectedVariant.label);
    if (selectedPackId) {
      const pack = product.variants?.find(v => v._id === selectedVariantId)?.packs?.find(p => p._id === selectedPackId)
        || product.packs?.find((p: any) => p._id === selectedPackId || p.id === selectedPackId);
      if (pack) descriptions.push(pack.label);
    }
    if (selectedColor) descriptions.push(selectedColor.label);
    if (selectedFragrance) descriptions.push(selectedFragrance);

    if (descriptions.length > 0) {
      itemName += ` (${descriptions.join(', ')})`;
    }

    const cartItem = {
      productId: product._id,
      name: itemName,
      image: selectedVariant?.image || product.images[0],
      price: pricingResult.finalPrice,
      originalPrice: pricingResult.basePrice,
      quantity: 1, // Default to 1
      variantId: selectedVariantId || undefined,
      packId: selectedPackId || undefined,
      styleId: selectedStyleId || undefined,
      addOnIds: selectedAddOnIds,
      // Color snapshot (NEW)
      selectedAttributes: selectedColor ? { "Color": selectedColor.label } : undefined,
      // Legacy fields
      size: !selectedVariantId ? selectedSize?.name : undefined,
      fragrance: selectedFragrance,
      fragrances: product.allowMixedFragrance ? selectedFragrances : undefined,
      giftCustomization: giftCustomization.active ? giftCustomization : undefined,
      // Breakdown for UI rehydration
      breakdown: {
        basePrice: product.price,
        multiplier: 1,
        addOns: selectedAddOnIds, // Note: ideally these should be labels, but IDs work for logic
        styles: selectedStyleId ? [selectedStyleId] : [],
        attributes: []
      }
    };

    dispatch(addToCart(cartItem));
    trackPixelEvent('AddToCart', {
      content_name: product.name,
      content_ids: [product._id],
      content_type: 'product',
      value: (cartItem.price || product.price) * (cartItem.quantity || 1),
      currency: 'INR'
    });
    toast.success('Added to cart!');
  };

  // Handle Buy Now
  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SEO title="Product Not Found" />
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product not found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-primary-600 hover:underline"
          >
            Return to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-28 lg:pb-12 text-[#2A2421]">
      <SEO 
        title={product.name} 
        description={product.shortDescription || product.description?.substring(0, 160) || ''} 
        image={product.images[0]}
        type="product"
      />
      <div className="max-w-7xl mx-auto px-4 py-2 lg:py-4">

        <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">

          {/* Left Column: Image Gallery (Sticky on Desktop) */}
          <div className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-24 mx-auto w-full">
            <ImageGallery
              images={product.images}
              productName={product.name}
              selectedImage={
                product.styles?.find(s => s._id === selectedStyleId)?.image ||
                selectedColor?.image ||
                product.variants?.find(v => v._id === selectedVariantId)?.image
              }
            />

            {/* Desktop CTA (Moved to Left Column) */}
            <div className="hidden lg:flex gap-4 mt-6">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 py-3 px-6 border border-primary-600 text-primary-600 font-bold rounded-sm border-2 hover:bg-primary-600 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 uppercase text-sm tracking-wide"
              >
                <FiShoppingBag className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 py-3 px-6 bg-primary-600 text-white font-bold rounded-sm border-2 border-primary-600 hover:bg-primary-700 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 uppercase text-sm tracking-wide shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          {/* Right Column: Product Info & Controls */}
          <div className="lg:col-span-7 xl:col-span-7 mt-4 lg:mt-0">
            <div className="flex flex-col gap-4 lg:gap-4">

              {/* Header Section */}
              {(() => {
                const defaultLayout = ['pricing', 'variants', 'styles', 'addons', 'gift', 'description', 'specs'];
                const layout = product.pdpLayout && product.pdpLayout.length > 0 ? product.pdpLayout : defaultLayout;

                const renderSection = (sectionId: string) => {
                  switch (sectionId) {
                    case 'pricing':
                      return (
                        <div key="pricing" className="border-b border-gray-100 pb-3">
                          <div className="flex items-start justify-between">
                            <h1 className="text-xl lg:text-3xl font-bold text-gray-900 leading-tight tracking-tight">
                              {product.name}
                            </h1>
                          </div>

                          <div className="mt-1.5 flex items-center gap-3">
                            <RatingsSummary
                              rating={product.rating}
                              totalReviews={product.totalReviews}
                            />
                          </div>

                          <div className="mt-2">
                            <PricingBlock
                              price={pricingResult.finalPrice}
                              originalPrice={pricingResult.basePrice}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Free shipping on all prepaid orders • 7-day easy returns
                            </p>
                          </div>
                        </div>
                      );

                    case 'variants':
                      const hasColors = product.colors && product.colors.length > 0;
                      const hasSizes = (!product.variants || product.variants.length === 0) && product.sizes && product.sizes.length > 0;
                      const hasVariants = product.variants && product.variants.length > 0;
                      const activeVariantForPacks = product.variants?.find(v => v._id === selectedVariantId);
                      const activePacks = activeVariantForPacks ? activeVariantForPacks.packs : product.packs;
                      const hasPacks = activePacks && activePacks.length > 0;
                      const hasFragranceStandalone = product.fragrances && product.fragrances.length > 0 && !hasPacks;

                      if (!hasColors && !hasSizes && !hasVariants && !hasPacks && !hasFragranceStandalone) return null;

                      return (
                        <div key="variants" className="space-y-4">
                          {hasColors && (
                            <div className="mb-2">
                              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.08em] mb-3 ml-0.5">Select Color</h3>
                              <div className="flex flex-wrap gap-2.5">
                                {product.colors?.map((color, index) => {
                                  const isSelected = selectedColor?.label === color.label;
                                  return (
                                    <button
                                      key={index}
                                      onClick={() => setSelectedColor(isSelected ? null : color)}
                                      className={`group relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${isSelected
                                        ? 'ring-2 ring-black ring-offset-2 scale-110'
                                        : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-1'
                                        }`}
                                      title={color.label}
                                    >
                                      <span
                                        className="w-full h-full rounded-full border border-gray-100 shadow-sm"
                                        style={{ backgroundColor: color.hex }}
                                      />
                                      {isSelected && (
                                        <span className="absolute inset-0 flex items-center justify-center">
                                          <svg className="w-5 h-5 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                          </svg>
                                        </span>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {hasSizes && (
                            <SizeSelector
                              sizes={product.sizes || []}
                              selectedSize={selectedSize}
                              onSelectSize={setSelectedSize}
                            />
                          )}

                          {hasVariants && (
                            <VariantSelector
                              variants={product.variants as any}
                              selectedVariantId={selectedVariantId}
                              onSelectVariant={(variantId) => {
                                setSelectedVariantId(variantId);
                                const variant = product.variants?.find(v => v._id === variantId);
                                if (variant && variant.packs && variant.packs.length > 0) {
                                  setSelectedPackId(variant.packs[0]._id);
                                } else {
                                  setSelectedPackId(null);
                                }
                              }}
                            />
                          )}

                          {hasPacks && (() => {
                            const activePack = activePacks.find((p: any) => p._id === selectedPackId || p.id === selectedPackId);
                            const quantity = (activePack as any)?.quantity || 1;

                            return (
                              <>
                                <PackSelector
                                  packs={activePacks as any}
                                  fragrances={product.allowMixedFragrance ? [] : (product.fragrances || [])}
                                  selectedPackId={selectedPackId}
                                  selectedFragrance={selectedFragrance}
                                  onSelectPack={(id) => {
                                    setSelectedPackId(id);
                                    if (product.allowMixedFragrance) {
                                      const pack = activePacks.find((p: any) => p._id === id || p.id === id);
                                      const qty = (pack as any)?.quantity || 1;
                                      const initialFrags = Array(qty).fill(product.fragrances?.[0] || '');
                                      setSelectedFragrances(initialFrags);
                                    }
                                  }}
                                  onSelectFragrance={setSelectedFragrance}
                                  basePrice={activeVariantForPacks ? activeVariantForPacks.price : product.price}
                                  baseOriginalPrice={activeVariantForPacks ? activeVariantForPacks.originalPrice : product.originalPrice}
                                  productImage={
                                    product.styles?.find(s => s._id === selectedStyleId)?.image ||
                                    activeVariantForPacks?.image ||
                                    product.images[0]
                                  }
                                />

                                {product.allowMixedFragrance && selectedPackId && product.fragrances && (
                                  <FragranceSelector
                                    candleCount={quantity}
                                    selectedFragrances={selectedFragrances}
                                    fragranceOptions={(product.fragrances || []).map(f => ({
                                      id: f,
                                      name: f,
                                      color: '#6B7280'
                                    }))}
                                    onFragranceChange={(index, val) => {
                                      const newFrags = [...selectedFragrances];
                                      newFrags[index] = val;
                                      setSelectedFragrances(newFrags);
                                    }}
                                  />
                                )}
                              </>
                            );
                          })()}

                          {hasFragranceStandalone && (
                            <div className="space-y-2 pt-1">
                              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.08em] mb-2 ml-0.5">Choose Fragrance</h3>
                              <div className="flex flex-wrap gap-1.5">
                                {(product.fragrances || []).map((fragrance: string, index: number) => (
                                  <button
                                    key={index}
                                    onClick={() => setSelectedFragrance(fragrance)}
                                    className={`px-1.5 py-0.5 text-[12px] font-bold rounded border transition-all ${selectedFragrance === fragrance
                                      ? 'border-black bg-black text-white shadow-sm'
                                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                                      }`}
                                  >
                                    {fragrance}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );

                    case 'styles':
                      {
                        const activeVariant = product.variants?.find(v => v._id === selectedVariantId);
                        const activePack = activeVariant
                          ? activeVariant.packs?.find(p => p._id === selectedPackId)
                          : product.packs?.find(p => (p as any)._id === selectedPackId || (p as any).id === selectedPackId);

                        const availableStyles = (activePack as any)?.styles?.length > 0
                          ? (activePack as any).styles
                          : product.styles;

                        if (!availableStyles || availableStyles.length === 0) return null;

                        return (
                          <div key="styles" className="mb-2">
                            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.08em] mb-2.5 ml-0.5">Customize Style</h3>
                            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
                              {availableStyles.map((style: any) => {
                                const styleId = style._id || style.id || style.label;
                                const isSelected = selectedStyleId === styleId || (selectedStyleId === style.label);

                                return (
                                  <button
                                    key={styleId}
                                    onClick={() => {
                                      const idToSet = style._id || style.id || style.label;
                                      setSelectedStyleId(isSelected ? null : idToSet);
                                    }}
                                    className={`group flex flex-col items-center justify-center p-2.5 rounded-lg border transition-all duration-200 relative min-h-[56px] ${isSelected
                                      ? 'border-black bg-black text-white shadow-md scale-[1.02] z-10'
                                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:shadow-sm'
                                      } cursor-pointer`}
                                  >
                                    <div className="text-[11px] font-bold uppercase tracking-wide truncate w-full px-1">{style.label}</div>
                                    {style.priceAdjustment !== 0 && (
                                      <div className={`text-[10px] mt-0.5 font-black ${isSelected ? 'text-gray-400' : 'text-gray-900'}`}>
                                        {style.priceAdjustment > 0 ? '+' : ''}₹{style.priceAdjustment}
                                      </div>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }

                    case 'addons':
                      if (!product.addOns || product.addOns.length === 0) return null;
                      return (
                        <div key="addons" className="mb-2">
                          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.08em] mb-2.5 ml-0.5">Add-Ons</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {product.addOns?.map((addon) => {
                              const isSelected = selectedAddOnIds.includes(addon._id);
                              return (
                                <label key={addon._id} className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all duration-200 ${isSelected ? 'border-black bg-black text-white shadow-md' : 'border-gray-100 bg-gray-50/50 hover:border-gray-300'}`}>
                                  <div className="flex items-center gap-2.5">
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-white border-white text-black' : 'border-gray-300 bg-white'}`}>
                                      {isSelected && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>}
                                    </div>
                                    <div className="flex flex-col">
                                      <span className={`text-[11px] font-black uppercase tracking-tight ${isSelected ? 'text-white' : 'text-gray-900'}`}>{addon.label}</span>
                                      {addon.description && <span className={`text-[9px] font-medium ${isSelected ? 'text-gray-400' : 'text-gray-500'}`}>{addon.description}</span>}
                                    </div>
                                  </div>
                                  <span className={`text-[11px] font-black ${isSelected ? 'text-white' : 'text-gray-900'}`}>+₹{addon.price}</span>
                                  <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={isSelected}
                                    onChange={() => {
                                      if (isSelected) {
                                        setSelectedAddOnIds(prev => prev.filter(id => id !== addon._id));
                                      } else {
                                        setSelectedAddOnIds(prev => [...prev, addon._id]);
                                      }
                                    }}
                                  />
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );

                    case 'gift':
                      if (!product.giftOptions?.active || !product.giftOptions.occasions?.length) return null;
                      return (
                        <div key="gift" className="mb-2">
                          <GiftCustomization
                            occasions={product.giftOptions?.occasions || []}
                            extraPrice={product.giftOptions?.price || 0}
                            onCustomizationChange={(data) => setGiftCustomization(data)}
                          />
                        </div>
                      );

                    case 'summary':
                      {
                        const basePriceForBreakdown = pricingResult.basePrice
                          - pricingResult.breakdown.styleAdjustment
                          - pricingResult.breakdown.addOnsTotal
                          - (giftCustomization.active ? giftCustomization.price : 0);

                        const hasBreakdown = pricingResult.discountAmount > 0
                          || pricingResult.breakdown.styleAdjustment > 0
                          || pricingResult.breakdown.addOnsTotal > 0
                          || giftCustomization.active;

                        if (!hasBreakdown) return null;

                        return (
                          <div key="summary" className="bg-gray-50/50 rounded-xl p-5 border border-gray-100 space-y-4 mb-2.5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gray-100/30 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />

                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] flex items-center justify-between">
                              <span>Order Price Breakdown</span>
                              <span className="h-px bg-gray-200 flex-1 ml-4"></span>
                            </h3>

                            <div className="space-y-3 text-[13px]">
                              {/* Base Price Line */}
                              <div className="flex justify-between text-gray-600 font-medium">
                                <span className="flex items-center gap-2">
                                  Base Configuration
                                </span>
                                <span className="font-bold text-gray-900">₹{basePriceForBreakdown.toLocaleString()}</span>
                              </div>

                              {/* Custom Style Line */}
                              {selectedStyleId && pricingResult.breakdown.styleAdjustment > 0 && (
                                <div className="flex justify-between text-gray-600 animate-in fade-in slide-in-from-left-2 duration-300">
                                  <span className="flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-blue-400" />
                                    {product.styles?.find(s => s._id === selectedStyleId)?.label || 'Selected Style'}
                                  </span>
                                  <span className="font-bold text-gray-900">+₹{pricingResult.breakdown.styleAdjustment.toLocaleString()}</span>
                                </div>
                              )}

                              {/* Add-ons Line */}
                              {selectedAddOnIds.length > 0 && pricingResult.breakdown.addOnsTotal > 0 && (
                                <div className="flex justify-between text-gray-600 animate-in fade-in slide-in-from-left-2 duration-400">
                                  <span className="flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-purple-400" />
                                    Add-ons ({selectedAddOnIds.length})
                                  </span>
                                  <span className="font-bold text-gray-900">+₹{pricingResult.breakdown.addOnsTotal.toLocaleString()}</span>
                                </div>
                              )}

                              {/* Personalization Line */}
                              {giftCustomization.active && giftCustomization.price > 0 && (
                                <div className="flex justify-between text-gray-600 animate-in fade-in slide-in-from-left-2 duration-500">
                                  <span className="flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-orange-400" />
                                    Gift Personalization
                                  </span>
                                  <span className="font-bold text-gray-900">+₹{giftCustomization.price.toLocaleString()}</span>
                                </div>
                              )}

                              {/* Discount Line */}
                              {pricingResult.discountAmount > 0 && (
                                <div className="flex justify-between text-green-600 font-bold bg-green-50/50 -mx-2 px-2 py-1.5 rounded-lg border border-green-100/50">
                                  <span className="flex items-center gap-2 italic">
                                    Total Discount Applied
                                  </span>
                                  <span className="tracking-tighter">-₹{pricingResult.discountAmount.toLocaleString()}</span>
                                </div>
                              )}
                            </div>

                            <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between items-end">
                              <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Estimated Total</p>
                                <p className="text-2xl font-black text-gray-900 tracking-tighter">₹{pricingResult.finalPrice.toLocaleString()}</p>
                              </div>
                              {pricingResult.discountAmount > 0 && (
                                <div className="text-right">
                                  <p className="text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-100 px-2 py-1 rounded-full inline-block">
                                    Saved ₹{pricingResult.discountAmount.toLocaleString()}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }

                    case 'description':
                      return (
                        <div key="description" className="hidden lg:block border-t border-gray-100 pt-4">
                          <ProductDescription
                            shortDescription={product.shortDescription || product.description.substring(0, 150)}
                            fullDescription={product.description}
                            showFull={showFullDescription}
                            onToggle={() => setShowFullDescription(!showFullDescription)}
                          />
                        </div>
                      );

                    case 'specs':
                      return (
                        <div key="specs" className="hidden lg:block">
                          <ProductSpecifications product={product} />
                        </div>
                      );

                    default:
                      return null;
                  }
                };

                return (
                  <div className="flex flex-col gap-4 lg:gap-4">
                    {layout.map(sectionId => renderSection(sectionId))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Bottom Sections */}
        <div className="mt-8 space-y-8">
          {/* Mobile Description */}
          <div className="lg:hidden">
            <ProductDescription
              shortDescription={product.shortDescription || product.description.substring(0, 200)}
              fullDescription={product.description}
              showFull={showFullDescription}
              onToggle={() => setShowFullDescription(!showFullDescription)}
            />
          </div>

          <div className="border-t pt-6">
            <ReviewsSection productId={product._id} />
          </div>

          {product.faqs && product.faqs.length > 0 && (
            <div className="border-t pt-6">
              <FAQSection faqs={product.faqs} />
            </div>
          )}

          <div className="border-t pt-6 pb-4">
            <RelatedProducts productId={product._id} categoryId={product.category._id} />
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar (Hidden on Desktop) */}
      <div className="lg:hidden">
        <StickyBottomBar
          finalPrice={pricingResult.finalPrice}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          disabled={product.stock === 0}
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;
