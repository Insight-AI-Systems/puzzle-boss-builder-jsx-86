
export interface Category {
  id: string;
  name: string;
  status: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  status: string;
  slug: string;
  description?: string;
  image_url?: string;
}
