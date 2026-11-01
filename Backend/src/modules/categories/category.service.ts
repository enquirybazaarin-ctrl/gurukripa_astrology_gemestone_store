import { Category, ICategory, ICategoryBase } from './category.model';
import { CustomError } from '../../common/middleware/errorHandler';

export class CategoryService {
  async getCategories(): Promise<ICategoryBase[]> {
    return Category.find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .lean();
  }

  async getCategoryById(id: string): Promise<ICategoryBase> {
    const category = await Category.findById(id).lean();
    if (!category) {
      throw new CustomError('Category not found', 404);
    }
    return category;
  }

  async createCategory(data: Partial<ICategory>): Promise<ICategoryBase> {
    const category = await Category.create(data);
    return category.toObject();
  }

  async updateCategory(id: string, data: Partial<ICategory>): Promise<ICategoryBase> {
    const category = await Category.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).lean();

    if (!category) {
      throw new CustomError('Category not found', 404);
    }
    return category;
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      throw new CustomError('Category not found', 404);
    }
  }
}

export const categoryService = new CategoryService();
