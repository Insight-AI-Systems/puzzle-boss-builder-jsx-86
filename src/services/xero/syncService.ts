
import { XERO_CONFIG } from './config';
import { SyncResult, XeroRecordType } from './types';

/**
 * Service for synchronizing data with Xero
 */
export class XeroSyncService {
  /**
   * Synchronizes data from Xero to local database
   * @param recordType - Type of records to sync (invoices, bills, contacts, etc.)
   * @param days - Number of days of history to sync
   * @returns Promise resolving to sync result
   */
  static async syncFromXero(
    recordType: XeroRecordType,
    days: number = 30
  ): Promise<SyncResult> {
    try {
      console.log(`[XERO SYNC] Starting sync for ${recordType}`);
      
      const response = await fetch(`${XERO_CONFIG.FUNCTION_BASE_URL}/xero-sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recordType,
          days
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Sync failed: ${errorText}`);
      }
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      return {
        success: true,
        message: `Successfully synchronized ${recordType} from Xero`,
        data: result
      };
    } catch (error) {
      console.error(`[XERO SYNC] Error syncing ${recordType}:`, error);
      return {
        success: false,
        message: error instanceof Error ? error.message : `Failed to sync ${recordType}`
      };
    }
  }
}
