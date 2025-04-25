
import { IssueType } from "@/types/issueTypes";
import { TicketStatus } from "@/types/supportTicketTypes";

type DbIssue = {
  id: string;
  title: string;
  description: string;
  status: 'wip' | 'completed' | 'deferred';
  category: string;
  workaround?: string;
  created_by?: string;
  modified_by?: string;
  created_at: string;
  updated_at: string;
};

export const mapDatabaseCategory = (category: string): IssueType['category'] => {
  if (['bug', 'performance', 'security', 'ui', 'feature'].includes(category)) {
    return category as IssueType['category'];
  }
  return 'bug';
};

export const mapDbStatusToFrontend = (status: DbIssue['status']): IssueType['status'] => {
  switch (status) {
    case 'wip': return 'in-progress';
    case 'completed': return 'resolved';
    case 'deferred': return 'deferred';
    default: return 'open';
  }
};

export const mapFrontendStatusToDb = (status: TicketStatus): 'wip' | 'completed' | 'deferred' => {
  switch (status) {
    case 'in-progress': return 'wip';
    case 'resolved': return 'completed';
    case 'closed': return 'completed';
    case 'open': 
    default: return 'wip';
  }
};

export const mapDbIssueToFrontend = (item: DbIssue): IssueType => ({
  id: item.id,
  title: item.title,
  description: item.description,
  status: mapDbStatusToFrontend(item.status),
  category: mapDatabaseCategory(item.category),
  workaround: item.workaround,
  created_by: item.created_by,
  modified_by: item.modified_by,
  created_at: item.created_at,
  updated_at: item.updated_at
});
