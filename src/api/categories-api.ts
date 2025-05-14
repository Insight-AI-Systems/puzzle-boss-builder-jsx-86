
import { apiClient } from '@/integrations/supabase/api-client';
import { CategoryModel, CategoryCreateDTO, CategoryUpdateDTO, mapDatabaseToCategory } from '@/types/category-models';

/**
 * Categories API Module
 * Provides type-safe access to category data
 */
export const categoriesApi = {
  /**
   * Fetch all categories with optional filtering
   */
  async getCategories(options?: {
    status?: string;
    includeCount?: boolean;
    orderBy?: string;
    ascending?: boolean;
  }): Promise<CategoryModel[]> {
    let query = '*';
    if (options?.includeCount) {
      query = '*, puzzles:puzzles(id)';
    }
    
    const response = await apiClient.get<any[]>('categories', {
      query,
      filters: options?.status ? { status: options.status } : undefined,
      orderBy: options?.orderBy || 'name',
      ascending: options?.ascending
    });
    
    if (response.error || !response.data) {
      console.error('Error fetching categories:', response.error);
      return [];
    }
    
    return response.data.map((category: any) => {
      const mappedCategory = mapDatabaseToCategory(category);
      
      // Add puzzle count if included
      if (options?.includeCount && Array.isArray(category.puzzles)) {
        mappedCategory.puzzleCount = category.puzzles.length;
        mappedCategory.activeCount = category.puzzles.filter(
          (p: any) => p.status === 'active'
        ).length;
      }
      
      return mappedCategory;
    });
  },
  
  /**
   * Fetch a single category by ID
   */
  async getCategoryById(id: string): Promise<CategoryModel | null> {
    const response = await apiClient.getById<any>('categories', id, {
      query: '*, puzzles:puzzles(id, status)'
    });
    
    if (response.error || !response.data) {
      console.error('Error fetching category:', response.error);
      return null;
    }
    
    const category = mapDatabaseToCategory(response.data);
    
    // Add puzzle counts
    if (Array.isArray(response.data.puzzles)) {
      category.puzzleCount = response.data.puzzles.length;
      category.activeCount = response.data.puzzles.filter(
        (p: any) => p.status === 'active'
      ).length;
    }
    
    return category;
  },
  
  /**
   * Create a new category
   */
  async createCategory(category: CategoryCreateDTO): Promise<CategoryModel | null> {
    const dbCategory = {
      name: category.name,
      slug: category.slug,
      description: category.description || null,
      image_url: category.imageUrl || null,
      status: category.status || 'inactive'
    };
    
    const response = await apiClient.create<any>('categories', dbCategory);
    
    if (response.error || !response.data) {
      console.error('Error creating category:', response.error);
      return null;
    }
    
    return mapDatabaseToCategory(response.data);
  },
  
  /**
   * Update an existing category
   */
  async updateCategory(category: CategoryUpdateDTO): Promise<CategoryModel | null> {
    const dbCategory: any = {};
    
    if (category.name !== undefined) dbCategory.name = category.name;
    if (category.slug !== undefined) dbCategory.slug = category.slug;
    if (category.description !== undefined) dbCategory.description = category.description;
    if (category.imageUrl !== undefined) dbCategory.image_url = category.imageUrl;
    if (category.status !== undefined) dbCategory.status = category.status;
    
    const response = await apiClient.update<any>('categories', category.id, dbCategory);
    
    if (response.error || !response.data) {
      console.error('Error updating category:', response.error);
      return null;
    }
    
    return mapDatabaseToCategory(response.data);
  },
  
  /**
   * Delete a category
   */
  async deleteCategory(id: string): Promise<boolean> {
    const response = await apiClient.delete('categories', id);
    
    if (response.error) {
      console.error('Error deleting category:', response.error);
      return false;
    }
    
    return true;
  }
};
