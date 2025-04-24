
export type IssueType = {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved';
  category: 'bug' | 'performance' | 'security' | 'ui' | 'feature';
  workaround?: string;
  created_by?: string;
  modified_by?: string;
  created_at?: string;
  updated_at?: string;
};

// Database types
export type DbIssueStatus = 'wip' | 'completed';

// Mapping functions between DB and frontend types
export const mapDbStatusToFrontend = (status: DbIssueStatus): IssueType['status'] => {
  switch (status) {
    case 'wip': return 'in-progress';
    case 'completed': return 'resolved';
    default: return 'open';
  }
};

export const mapFrontendStatusToDb = (status: IssueType['status']): DbIssueStatus => {
  switch (status) {
    case 'in-progress': return 'wip';
    case 'resolved': return 'completed';
    default: return 'wip';
  }
};
