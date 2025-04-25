
export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed' | 'pending';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketCategory = 'tech' | 'account' | 'billing' | 'prize' | 'feedback' | 'other' | 'internal';

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  assigned_to?: string;
  attachments?: string[];
  comments?: TicketComment[];
}

export interface TicketComment {
  id: string;
  ticket_id: string;
  content: string;
  created_by?: string;
  created_at: string;
  is_staff?: boolean;
}

export interface TicketFilters {
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: TicketCategory;
  search?: string;
  page: number;
  limit: number;
}

// Base interface for use with the convertIssueToTicket function
export interface BaseIssue {
  id: string;
  title: string;
  description: string;
  status: string;
  category: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  workaround?: string;
}

// Convert from BaseIssue to SupportTicket
export const convertIssueToTicket = (issue: BaseIssue): SupportTicket => {
  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    status: issue.status as TicketStatus,
    priority: (issue.category === 'security' ? 'high' : issue.category === 'bug' ? 'medium' : 'low') as TicketPriority,
    category: 'tech',
    created_at: issue.created_at,
    updated_at: issue.updated_at,
    created_by: issue.created_by,
    comments: []
  };
};

// Convert from SupportTicket to BaseIssue (for internal tracking)
export const convertTicketToIssue = (ticket: SupportTicket): BaseIssue => {
  // Map frontend status to database status
  let dbStatus: string;
  
  switch(ticket.status) {
    case 'in-progress': 
      dbStatus = 'in-progress';
      break;
    case 'resolved':
      dbStatus = 'resolved';
      break;
    case 'closed':
      dbStatus = 'resolved';
      break;
    case 'pending':
      dbStatus = 'in-progress';
      break;
    default: 
      dbStatus = 'open';
  }
  
  // Map frontend category to database category
  let dbCategory: string;
  
  if (ticket.category === 'tech') {
    dbCategory = 'bug';
  } else if (ticket.category === 'billing') {
    dbCategory = 'feature';
  } else if (ticket.category === 'internal') {
    dbCategory = 'performance';
  } else {
    dbCategory = 'ui';
  }
  
  return {
    id: ticket.id,
    title: ticket.title,
    description: ticket.description,
    status: dbStatus,
    category: dbCategory,
    created_at: ticket.created_at,
    updated_at: ticket.updated_at,
    created_by: ticket.created_by
  };
};
