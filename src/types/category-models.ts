
/**
 * Core category model representing a puzzle category entity
 */
export interface CategoryModel {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  status: string;
  puzzleCount?: number;
  activeCount?: number;
}

/**
 * Category with extended statistics
 */
export interface CategoryWithStats extends CategoryModel {
  totalRevenue?: number;
  popularityRank?: number;
  completionRate?: number;
  avgCompletionTime?: number;
}

/**
 * Category creation data transfer object
 */
export interface CategoryCreateDTO {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  status?: string;
}

/**
 * Category update data transfer object
 */
export interface CategoryUpdateDTO {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  status?: string;
}

/**
 * Type guard to check if an object is a valid CategoryModel
 */
export function isCategoryModel(obj: unknown): obj is CategoryModel {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'slug' in obj &&
    'status' in obj
  );
}

/**
 * Maps database category response to frontend CategoryModel
 */
export function mapDatabaseToCategory(dbCategory: any): CategoryModel {
  return {
    id: dbCategory.id,
    name: dbCategory.name,
    slug: dbCategory.slug,
    description: dbCategory.description,
    imageUrl: dbCategory.image_url,
    status: dbCategory.status,
    puzzleCount: dbCategory.puzzle_count,
    activeCount: dbCategory.active_count
  };
}
