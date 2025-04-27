
export type TicketType = 'internal' | 'external';
export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed' | 'pending';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketCategory = 'tech' | 'billing' | 'general' | 'internal';

export interface Department {
  id: number;
  name: string;
  private: boolean;
}

export interface TicketComment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  is_staff?: boolean;
  created_by?: string;
  created_at?: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  type: TicketType;
  status: TicketStatus;
  priority: TicketPriority;
  created_by: string;
  assigned_to?: string;
  comments: TicketComment[];
  created_at: string;
  updated_at: string;
  departmentId?: number;
  userEmail?: string;
  date?: string;
}

export interface TicketFilters {
  status?: TicketStatus;
  type?: TicketType;
  priority?: TicketPriority;
  assigned_to?: string;
  departmentId?: number;
  search?: string;
  page: number;
  limit: number;
}
