
export interface ProductImage {
  id: string;
  name: string;
  description: string | null;
  category_id: string | null;
  imageUrl: string;
  status: string;
  created_at: string;
  created_by: string | null;
}
