import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { XeroService } from '@/services/xero';
import { MemberDetailedProfile, XeroUserMapping } from '@/types/memberTypes';
import { toast } from '@/hooks/use-toast';

export function useXeroMemberSync() {
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const queryClient = useQueryClient();

  // Sync member to Xero
  const syncMemberToXero = useMutation({
    mutationFn: async (member: MemberDetailedProfile) => {
      setSyncInProgress(true);
      setError(null);
      
      try {
        // First check if they already have a mapping
        let xeroContactId = member.xero_mapping?.xero_contact_id;
        
        // If no mapping exists, create a new contact in Xero
        if (!xeroContactId) {
          const result = await XeroService.createContact({
            name: member.full_name || member.display_name || 'Unknown',
            email: member.email || 'unknown@example.com',
            phone: member.phone,
            addresses: [{
              addressType: 'STREET',
              addressLine1: member.address_line1,
              addressLine2: member.address_line2,
              city: member.city,
              region: member.state,
              postalCode: member.postal_code,
              country: member.country
            }]
          });
          
          if (!result.success || !result.data?.contactID) {
            throw new Error(result.message || 'Failed to create Xero contact');
          }
          
          xeroContactId = result.data.contactID;
          
          // Create mapping in our database
          await supabase
            .from('xero_user_mappings')
            .insert({
              user_id: member.id,
              xero_contact_id: xeroContactId,
              sync_status: 'active'
            });
        } 
        // Otherwise update existing contact
        else {
          const result = await XeroService.updateContact({
            contactID: xeroContactId,
            name: member.full_name || member.display_name || 'Unknown',
            email: member.email || '',
            phone: member.phone,
            addresses: [{
              addressType: 'STREET',
              addressLine1: member.address_line1,
              addressLine2: member.address_line2,
              city: member.city,
              region: member.state,
              postalCode: member.postal_code,
              country: member.country
            }]
          });
          
          if (!result.success) {
            throw new Error(result.message || 'Failed to update Xero contact');
          }
          
          // Update mapping last sync timestamp
          await supabase
            .from('xero_user_mappings')
            .update({
              last_synced: new Date().toISOString(),
              sync_status: 'active'
            })
            .eq('user_id', member.id);
        }
        
        return {
          success: true,
          xeroContactId
        };
      } catch (err) {
        console.error('Error syncing member to Xero:', err);
        
        // Update mapping status on error
        if (member.id && member.xero_mapping) {
          await supabase
            .from('xero_user_mappings')
            .update({
              last_synced: new Date().toISOString(),
              sync_status: 'error'
            })
            .eq('user_id', member.id);
        }
        
        setError(err instanceof Error ? err : new Error('Failed to sync with Xero'));
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        };
      } finally {
        setSyncInProgress(false);
      }
    },
    onSuccess: (result) => {
      if (result.success) {
        toast({
          title: "Xero Sync Successful",
          description: "Member has been synchronized with Xero",
        });
        queryClient.invalidateQueries({ queryKey: ['member-profile'] });
      } else {
        toast({
          title: "Xero Sync Failed",
          description: result.error || "Failed to sync with Xero",
          variant: "destructive",
        });
      }
    },
    onError: (err) => {
      toast({
        title: "Xero Sync Failed",
        description: err instanceof Error ? err.message : 'An unknown error occurred',
        variant: "destructive",
      });
    }
  });

  const unlinkFromXero = useMutation({
    mutationFn: async (userId: string) => {
      try {
        // Delete the mapping
        const { error } = await supabase
          .from('xero_user_mappings')
          .delete()
          .eq('user_id', userId);
          
        if (error) throw error;
        
        return { success: true };
      } catch (err) {
        console.error('Error unlinking from Xero:', err);
        setError(err instanceof Error ? err : new Error('Failed to unlink from Xero'));
        return { 
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        };
      }
    },
    onSuccess: (result) => {
      if (result.success) {
        toast({
          title: "Xero Connection Removed",
          description: "Member has been unlinked from Xero",
        });
        queryClient.invalidateQueries({ queryKey: ['member-profile'] });
      } else {
        toast({
          title: "Unlink Failed",
          description: result.error || "Failed to unlink from Xero",
          variant: "destructive",
        });
      }
    }
  });

  return {
    syncMemberToXero,
    unlinkFromXero,
    syncInProgress,
    error
  };
}
