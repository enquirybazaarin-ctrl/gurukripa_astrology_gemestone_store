import { Product, IProduct } from './product.model';
import { Category } from '../categories/category.model';
import { CustomError } from '../../common/middleware/errorHandler';
import mongoose from 'mongoose';

interface GetProductsParams {
  page: number;
  limit: number;
  category?: string;
  search?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  showOnHome?: boolean;
}

import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

const GEMSTONE_SYNONYMS: Record<string, string> = {
  'neelam': 'blue sapphire',
  'panna': 'emerald',
  'pukhraj': 'yellow sapphire',
  'moti': 'pearl',
  'manik': 'ruby',
  'gomed': 'hessonite',
  'lahsuniya': 'cats eye',
  'cats eye': "cat's eye",
  'moonga': 'red coral'
};

export class ProductService {
  private normalizeSearchQuery(query: string): string {
    if (!query) return query;
    let normalized = query.toLowerCase().trim();
    for (const [synonym, standard] of Object.entries(GEMSTONE_SYNONYMS)) {
      if (normalized.includes(synonym)) {
        normalized = normalized.replace(new RegExp(synonym, 'g'), standard);
      }
    }
    return normalized;
  }

  // ... existing resolveCategory method ...
  private async resolveCategory(categoryInput: string | mongoose.Types.ObjectId): Promise<mongoose.Types.ObjectId> {
    if (mongoose.isValidObjectId(categoryInput)) {
      return categoryInput as mongoose.Types.ObjectId;
    }

    // Try to find by slug
    const category = await Category.findOne({ slug: categoryInput });
    if (!category) {
      console.warn(`[ProductService] Category not found for input: ${categoryInput}`);
      throw new CustomError(`Category not found: ${categoryInput}`, 400);
    }
    return category._id as mongoose.Types.ObjectId;
  }

  async getProducts(params: GetProductsParams) {
    const { page, limit, category, search, sort, minPrice, maxPrice, showOnHome } = params;
    const skip = (page - 1) * limit;

    const isCacheable = showOnHome && !search && !category && !minPrice && !maxPrice;
    const cacheKey = `home-products-${page}-${limit}-${sort || 'default'}`;

    if (isCacheable) {
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    const query: any = { status: 'active' };

    if (showOnHome !== undefined) {
      query.showOnHome = showOnHome;
    }

    if (category) {
      if (category === 'best-selling') {
        query.isBestSeller = true;
      }
      // If filtering by category slug, we might need to look it up or filter by populated field?
      // Usually better to find the category ID first.
      else if (mongoose.isValidObjectId(category)) {
        query.category = category;
      } else {
        const catDoc = await Category.findOne({ slug: category });
        if (catDoc) {
          query.category = catDoc._id;
        } else {
          // If category slug provided but not found, ideally return empty or ignore?
          // For now, let's assume it matches nothing if not found
          console.log(`[ProductService] Category slug not found: ${category}`);
          return {
            products: [],
            pagination: { page, limit, total: 0, pages: 0 }
          };
        }
      }
    }

    if (search) {
      const normalizedSearch = this.normalizeSearchQuery(search);
      query.$text = { $search: normalizedSearch };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }

    let sortQuery: any = {};
    if (sort === 'price_asc') sortQuery.price = 1;
    else if (sort === 'price_desc') sortQuery.price = -1;
    else if (sort === 'rating') sortQuery.rating = -1;
    else if (sort === 'newest') sortQuery.createdAt = -1;
    else {
      sortQuery.sortOrder = 1;
      sortQuery.createdAt = -1;
    }

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query)
    ]);

    const result = {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };

    if (isCacheable) {
      cache.set(cacheKey, result);
    }

    return result;
  }

  async getProductById(id: string): Promise<IProduct> {
    const product = await Product.findById(id)
      .populate('category', 'name slug')
      .lean();

    if (!product) {
      throw new CustomError('Product not found', 404);
    }

    return product as unknown as IProduct;
  }

  async searchProducts(query: string, page: number = 1, limit: number = 20) {
    return this.getProducts({ page, limit, search: query });
  }

  async getProductsByCategory(categoryId: string, page: number = 1, limit: number = 20) {
    return this.getProducts({ page, limit, category: categoryId });
  }

  async getBestSellingProducts(limit: number = 10) {
    const cacheKey = `best-selling-${limit}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const products = await Product.find({ isActive: true, isBestSeller: true })
      .populate('category', 'name slug')
      .sort({ rating: -1, totalReviews: -1 })
      .limit(limit)
      .lean();

    cache.set(cacheKey, products);
    return products;
  }

  async createProduct(productData: any): Promise<IProduct> {
    if (productData.category) {
      productData.category = await this.resolveCategory(productData.category);
    }

    const product = new Product(productData);
    return product.save();
  }

  async updateProduct(id: string, updateData: any): Promise<IProduct> {
    if (updateData.category) {
      updateData.category = await this.resolveCategory(updateData.category);
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!product) {
      throw new CustomError('Product not found', 404);
    }

    return product as unknown as IProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      throw new CustomError('Product not found', 404);
    }
  }

  async autocomplete(query: string) {
    if (!query || query.length < 2) {
      return [];
    }

    const normalizedQuery = this.normalizeSearchQuery(query);

    const products = await Product.find({
      isActive: true,
      $text: { $search: normalizedQuery }
    })
      .select('name images price category')
      .populate('category', 'name slug')
      .limit(8)
      .lean();

    return products.map(p => ({
      _id: p._id,
      name: p.name,
      image: p.images[0],
      price: p.price,
      category: p.category
    }));
  }

  async getRelatedProducts(productId: string, limit: number = 10) {
    const product = await Product.findById(productId).lean();

    if (!product) {
      throw new CustomError('Product not found', 404);
    }

    // If manual related products are set, use them
    if (product.relatedProducts && product.relatedProducts.length > 0) {
      return Product.find({
        _id: { $in: product.relatedProducts },
        isActive: true
      })
        .populate('category', 'name slug')
        .limit(limit)
        .lean();
    }

    // Otherwise, return products from same category (excluding current product)
    return Product.find({
      category: product.category,
      _id: { $ne: productId },
      isActive: true
    })
      .populate('category', 'name slug')
      .sort({ rating: -1, totalReviews: -1 })
      .limit(limit)
      .lean();
  }
}

export const productService = new ProductService();
