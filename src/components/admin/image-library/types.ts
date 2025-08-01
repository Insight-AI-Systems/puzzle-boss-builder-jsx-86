
export interface ProductImage {
  id: string;
  name: string;
  description: string | null;
  category_id: string | null;
  tags: string[] | null;
  imageUrl: string;
  url?: string; // For compatibility
  status: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  metadata: any;
  image_files?: any[];
  dimensions?: { width: number; height: number };
}
