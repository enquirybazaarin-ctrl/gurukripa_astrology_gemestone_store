import { Request, Response, NextFunction } from 'express';
import { productService } from './product.service';

export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = 1, limit = 100, category, search, sort, minPrice, maxPrice } = req.query;
    const products = await productService.getProducts({
      page: Number(page),
      limit: Number(limit),
      category: category as string,
      search: search as string,
      sort: sort as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      showOnHome: req.query.showOnHome !== undefined ? req.query.showOnHome === 'true' : undefined
    });

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    next(error);
  }
};

export const searchProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { q, page = 1, limit = 100 } = req.query;
    const products = await productService.searchProducts(q as string, Number(page), Number(limit));
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

export const autocomplete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { q } = req.query;
    const suggestions = await productService.autocomplete(q as string);
    res.json({
      success: true,
      data: { suggestions }
    });
  } catch (error) {
    next(error);
  }
};

export const getProductsByCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = 1, limit = 100 } = req.query;
    const products = await productService.getProductsByCategory(
      req.params.categoryId,
      Number(page),
      Number(limit)
    );
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};
export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({
      success: true,
      data: { product }
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await productService.deleteProduct(req.params.id);
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getRelatedProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { limit = 10 } = req.query;
    const products = await productService.getRelatedProducts(req.params.id, Number(limit));
    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    next(error);
  }
};
