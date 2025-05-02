
export interface WebhookLog {
  id: string;
  provider: string;
  event_type: string;
  raw_data: any;
  processed: boolean;
  created_at: string;
}

export interface IntegrationWebhook {
  id: string;
  type: string;
  provider: string;
  url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface XeroInvoice {
  id: string;
  xero_id: string;
  invoice_number: string;
  date: string;
  due_date: string;
  status: string;
  total: number;
  contact_name: string;
  raw_data: any;
  last_synced: string;
  created_at: string;
}

export interface XeroBill {
  id: string;
  xero_id: string;
  bill_number: string;
  date: string;
  due_date: string;
  status: string;
  total: number;
  vendor_name: string;
  raw_data: any;
  last_synced: string;
  created_at: string;
}

export interface XeroTransaction {
  id: string;
  xero_id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
  account_code: string;
  contact_name: string;
  raw_data: any;
  last_synced: string;
  created_at: string;
}

export interface SyncResult {
  success: boolean;
  message: string;
  data?: any;
}

export interface SyncLog {
  id: string;
  integration: string;
  direction: 'inbound' | 'outbound';
  record_type: string;
  record_id: string;
  status: 'success' | 'failed';
  error_message?: string;
  created_at: string;
}
