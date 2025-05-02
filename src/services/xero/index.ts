
import { XeroAuthService } from './authService';
import { XeroDataService } from './dataService';
import { XeroSyncService } from './syncService';
import { XeroWebhookService } from './webhookService';
import { XeroRecordType } from './types';

/**
 * Unified service for working with Xero API and data
 */
export class XeroService {
  /**
   * Authentication related methods
   */
  static initiateAuth = XeroAuthService.initiateAuth;
  static getConnectionStatus = XeroAuthService.getConnectionStatus;
  static refreshToken = XeroAuthService.refreshToken;
  static disconnect = XeroAuthService.disconnect;
  
  /**
   * Data synchronization methods
   */
  static syncFromXero = XeroSyncService.syncFromXero;
  
  /**
   * Data retrieval methods
   */
  static getInvoices = XeroDataService.getInvoices;
  static getBills = XeroDataService.getBills;
  static getTransactions = XeroDataService.getTransactions;
  static getContacts = XeroDataService.getContacts;
  static getSyncLogs = XeroDataService.getSyncLogs;
  
  /**
   * Webhook related methods
   */
  static registerWebhook = XeroWebhookService.registerWebhook;
  static getActiveWebhooks = XeroDataService.getActiveWebhooks;
  static getWebhookLogs = XeroDataService.getWebhookLogs;
  static deleteWebhook = XeroWebhookService.deleteWebhook;
}

// Re-export types for convenience
export * from './types';
