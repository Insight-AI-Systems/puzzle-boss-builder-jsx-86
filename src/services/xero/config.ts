
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
  ],
  
  // Member fields to sync with Xero contacts
  CONTACT_FIELDS: {
    REQUIRED: ["full_name", "email"],
    OPTIONAL: ["phone", "address_line1", "address_line2", "city", "state", "postal_code", "country", "tax_id"]
  }
};

/**
 * Types for Xero records
 */
export type XeroRecordType = 'invoices' | 'bills' | 'contacts' | 'transactions' | 'all' | 'members';

/**
 * Member sync direction
 */
export type SyncDirection = 'to_xero' | 'from_xero' | 'bidirectional';
