
import { supabase } from '@/integrations/supabase/client';
import { XERO_CONFIG, SyncDirection } from './config';
import { MemberSyncData } from '@/types/memberTypes';
import { XeroContact } from '@/types/integration';

/**
 * Functions for synchronizing members with Xero
 */
export const memberSync = {
  /**
   * Sync a member's data with Xero
   */
  syncMember: async (userId: string, direction: SyncDirection = 'to_xero'): Promise<{
    success: boolean;
    message: string;
    data?: any;
  }> => {
    try {
      const functionUrl = `${XERO_CONFIG.FUNCTION_BASE_URL}/xero-member-sync`;
      
      // Call the edge function
      const { data, error } = await supabase.functions.invoke<{
        success: boolean;
        message: string;
        data?: any;
      }>('xero-member-sync', {
        body: {
          userId,
          direction
        }
      });

      if (error) {
        console.error('Error calling xero-member-sync function:', error);
        return {
          success: false,
          message: `Error syncing member: ${error.message}`,
        };
      }

      if (!data) {
        return {
          success: false,
          message: 'No data returned from sync function',
        };
      }

      return data;
    } catch (err) {
      console.error('Exception in syncMember:', err);
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Unknown error syncing member',
      };
    }
  },

  /**
   * Create a new contact in Xero from member data
   */
  createContact: async (contactData: {
    name: string;
    email: string;
    phone?: string;
    addresses?: Array<{
      addressType: string;
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      region?: string;
      postalCode?: string;
      country?: string;
    }>;
  }): Promise<{
    success: boolean;
    message: string;
    data?: {
      contactID: string;
    };
  }> => {
    try {
      // Call the edge function
      const { data, error } = await supabase.functions.invoke<{
        success: boolean;
        message: string;
        data?: {
          contactID: string;
        };
      }>('xero-create-contact', {
        body: contactData
      });

      if (error) {
        console.error('Error calling xero-create-contact function:', error);
        return {
          success: false,
          message: `Error creating Xero contact: ${error.message}`,
        };
      }

      if (!data) {
        return {
          success: false,
          message: 'No data returned from contact creation function',
        };
      }

      return data;
    } catch (err) {
      console.error('Exception in createContact:', err);
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Unknown error creating Xero contact',
      };
    }
  },

  /**
   * Update an existing contact in Xero
   */
  updateContact: async (contactData: {
    contactID: string;
    name?: string;
    email?: string;
    phone?: string;
    addresses?: Array<{
      addressType: string;
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      region?: string;
      postalCode?: string;
      country?: string;
    }>;
  }): Promise<{
    success: boolean;
    message: string;
  }> => {
    try {
      // Call the edge function
      const { data, error } = await supabase.functions.invoke<{
        success: boolean;
        message: string;
      }>('xero-update-contact', {
        body: contactData
      });

      if (error) {
        console.error('Error calling xero-update-contact function:', error);
        return {
          success: false,
          message: `Error updating Xero contact: ${error.message}`,
        };
      }

      if (!data) {
        return {
          success: false,
          message: 'No data returned from contact update function',
        };
      }

      return data;
    } catch (err) {
      console.error('Exception in updateContact:', err);
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Unknown error updating Xero contact',
      };
    }
  },

  /**
   * Get all member data that can be synced with Xero
   */
  getAllSyncableMembers: async (limit = 100, offset = 0): Promise<{
    success: boolean;
    message: string;
    data?: MemberSyncData[];
    count?: number;
  }> => {
    try {
      // Call the edge function
      const { data, error } = await supabase.functions.invoke<{
        success: boolean;
        message: string;
        data?: MemberSyncData[];
        count?: number;
      }>('xero-get-syncable-members', {
        body: { limit, offset }
      });

      if (error) {
        console.error('Error calling xero-get-syncable-members function:', error);
        return {
          success: false,
          message: `Error getting syncable members: ${error.message}`,
        };
      }

      if (!data) {
        return {
          success: false,
          message: 'No data returned from get syncable members function',
        };
      }

      return data;
    } catch (err) {
      console.error('Exception in getAllSyncableMembers:', err);
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Unknown error getting syncable members',
      };
    }
  }
};
