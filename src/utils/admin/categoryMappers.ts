
import { AdminCategory } from '@/types/categoryTypes';

export const mapDbCategory = (category: Record<string, any>): AdminCategory => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description || '',
  image_url: category.image_url || "/placeholder.svg",
  status:
    category.status === "active" || category.status === "inactive"
      ? category.status
      : "inactive",
});
