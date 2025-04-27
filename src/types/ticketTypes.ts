
export interface Ticket {
  id: string;
  title: string;
  description: string;
  type: 'internal' | 'external';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  created_by: string;
  assigned_to?: string;
  comments: Array<{
    author: string;
    content: string;
    timestamp: string;
  }>;
  created_at: string;
  updated_at: string;
}
