
import { auth } from './auth';
import { syncFromXero } from './sync';
import { disconnect } from './disconnect';
import { getConnectionStatus } from './status';
import { getInvoices, getBills, getContacts, getTransactions } from './records';
import { webhooks } from './webhooks';
import { memberSync } from './memberSync';

export const XeroService = {
  // Authentication
  initiateAuth: auth.initiateAuth,
  refreshToken: auth.refreshToken,
  
  // Status
  getConnectionStatus,
  disconnect,
  
  // Data syncing
  syncFromXero,
  
  // Record retrieval
  getInvoices,
  getBills,
  getContacts,
  getTransactions,
  
  // Webhook management
  getWebhooks: webhooks.getWebhooks,
  getActiveWebhooks: webhooks.getActiveWebhooks, // Added missing function
  getWebhookLogs: webhooks.getWebhookLogs, // Added missing function
  createWebhook: webhooks.createWebhook,
  deleteWebhook: webhooks.deleteWebhook,
  registerWebhook: webhooks.createWebhook, // Alias for createWebhook for compatibility
  
  // Member sync operations
  syncMember: memberSync.syncMember,
  createContact: memberSync.createContact,
  updateContact: memberSync.updateContact,
  getAllSyncableMembers: memberSync.getAllSyncableMembers
};
