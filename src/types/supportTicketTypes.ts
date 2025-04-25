
import { IssueType } from "./issueTypes";

export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketCategory = 'tech' | 'account' | 'billing' | 'prize' | 'feedback' | 'other';

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

// Convert from IssueType to SupportTicket
export const convertIssueToTicket = (issue: IssueType): SupportTicket => {
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

// Convert from SupportTicket to IssueType (for internal tracking)
export const convertTicketToIssue = (ticket: SupportTicket): IssueType => {
  // Map frontend status to database status
  let dbStatus: 'open' | 'in-progress' | 'resolved' | 'deferred';
  
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
    default: 
      dbStatus = 'open';
  }
  
  // Map frontend category to database category
  let dbCategory: 'bug' | 'feature' | 'ui' | 'security' | 'performance';
  
  if (ticket.category === 'tech') {
    dbCategory = 'bug';
  } else if (ticket.category === 'billing') {
    dbCategory = 'feature';
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
