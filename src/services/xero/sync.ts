
import { supabase } from '@/integrations/supabase/client';
import { XeroRecordType } from './config';

export async function syncFromXero(recordType: XeroRecordType = 'all') {
  try {
    const { data, error } = await supabase.functions.invoke('xero-sync', {
      body: { recordType }
    });
    
    if (error) throw error;
    
    return {
      success: true,
      message: `Successfully synced ${recordType} data from Xero`,
      data
    };
  } catch (err) {
    console.error('Error syncing from Xero:', err);
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Failed to sync data from Xero',
    };
  }
}
