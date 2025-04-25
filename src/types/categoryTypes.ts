
import { Category } from '@/hooks/useCategories';

export interface AdminCategory extends Category {
  puzzleCount?: number;
  activeCount?: number;
  status?: 'active' | 'inactive';
  imageUrl?: string;
}

export interface CategoryMutationOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}
