
import { Category } from '@/hooks/useCategories';

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  status: string;
  icon?: string;
  puzzleCount?: number;
  activeCount?: number;
  imageUrl?: string;
}

export interface CategoryMutationOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}
