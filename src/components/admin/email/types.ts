
export type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  type: 'verification' | 'notification' | 'marketing' | 'system';
  status: 'active' | 'draft' | 'archived';
  created_at: string;
  last_sent?: string;
};

export type EmailCampaign = {
  id: string;
  name: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'draft';
  audience: string;
  recipients: number;
  sent: number;
  opened: number;
  scheduled_for?: string;
  created_at: string;
};

