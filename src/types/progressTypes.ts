
export interface ProgressItem {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  description?: string; 
  created_at: string;
  updated_at: string;
  last_edited_by?: string;
  progress_comments: ProgressComment[];
}

export interface ProgressComment {
  id: string;
  content: string;
  progress_item_id: string;
  created_at: string;
}
