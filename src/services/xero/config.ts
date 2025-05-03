
/**
 * Configuration settings for the Xero integration
 */
export const XERO_CONFIG = {
  // Base URL for Xero edge functions
  FUNCTION_BASE_URL: "https://vcacfysfjgoahledqdwa.supabase.co/functions/v1",
  
  // Debug mode - set to true to enable additional logging
  DEBUG: true,
  
  // Event types available for Xero webhooks
  EVENT_TYPES: [
    "INVOICE_CREATED", 
    "INVOICE_UPDATED", 
    "CONTACT_CREATED",
    "CONTACT_UPDATED",
    "BILL_CREATED",
    "BILL_UPDATED"
  ]
};

/**
 * Types for Xero records
 */
export type XeroRecordType = 'invoices' | 'bills' | 'contacts' | 'transactions' | 'all';
