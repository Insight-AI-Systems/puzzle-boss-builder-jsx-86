
export type TicketStatus = 'open' | 'pending' | 'closed' | 'resolved';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Ticket {
  id: string;
  title: string;
  content: string;
  userId: string;
  userEmail: string;
  departmentId: number;
  status: TicketStatus;
  priority: TicketPriority;
  date: string;
  file?: string;
  language?: string;
  tags?: string[];
  closed: boolean;
  assignedStaffId?: number;
  unread: boolean;
}

export interface TicketComment {
  id: number;
  content: string;
  date: string;
  file?: string;
  authorId: string;
  authorStaff?: boolean;
  authorName: string;
  edited?: boolean;
  editedContent?: string;
}

export interface Department {
  id: number;
  name: string;
  private: boolean;
}

export interface TicketFilters {
  status?: TicketStatus;
  departmentId?: number;
  priority?: TicketPriority;
  search?: string;
  page: number;
  limit: number;
}
