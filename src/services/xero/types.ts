
// Re-export types from the main types file for convenience
export {
  XeroInvoice,
  XeroBill,
  XeroTransaction,
  XeroContact,
  XeroOAuthToken,
  SyncResult,
  XeroAuthStatus,
  SyncLog
} from '@/types/integration';

// Types specific to the Xero service implementation
export type XeroRecordType = 'invoices' | 'bills' | 'contacts' | 'transactions' | 'all';
