
import { supabase } from '@/integrations/supabase/client';
import { MemberDetailedProfile, MemberSyncData } from '@/types/memberTypes';

export const memberSync = {
  // Sync a member with Xero
  async syncMember(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('xero-member-sync', {
        body: { userId }
      });
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error syncing member:', err);
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Failed to sync member'
      };
    }
  },
  
  // Create contact in Xero
  async createContact(contactData: any): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('xero-create-contact', {
        body: contactData
      });
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error creating Xero contact:', err);
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Failed to create Xero contact'
      };
    }
  },
  
  // Update contact in Xero
  async updateContact(contactData: any): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('xero-update-contact', {
        body: contactData
      });
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error updating Xero contact:', err);
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Failed to update Xero contact'
      };
    }
  },
  
  // Get all syncable members
  async getAllSyncableMembers(limit = 50, offset = 0): Promise<MemberSyncData[]> {
    try {
      const { data, error } = await supabase.functions.invoke('xero-get-syncable-members', {
        body: { limit, offset }
      });
      
      if (error) throw error;
      return data?.members || [];
    } catch (err) {
      console.error('Error getting syncable members:', err);
      return [];
    }
  }
};
