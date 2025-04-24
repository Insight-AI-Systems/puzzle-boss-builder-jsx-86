
export type IssueType = {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved';
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'bug' | 'performance' | 'security' | 'ui' | 'feature';
  workaround?: string;
  created_by?: string;
  modified_by?: string;
  created_at?: string;
  updated_at?: string;
};
