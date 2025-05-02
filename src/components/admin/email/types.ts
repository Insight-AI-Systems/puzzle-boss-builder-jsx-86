
export type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  content: string; // Added missing content property
  type: 'verification' | 'notification' | 'marketing' | 'system' | 'membership';
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

export type MembershipTier = {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year' | 'one-time';
  features: string[];
  credits: number;
  is_popular?: boolean;
  stripe_price_id?: string;
};
