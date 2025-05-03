
import { supabase } from '@/integrations/supabase/client';
import { XeroInvoice, XeroBill, XeroContact, XeroTransaction } from './types';

// Fetch invoices with pagination
export async function getInvoices(limit = 10, offset = 0): Promise<XeroInvoice[]> {
  try {
    const { data, error } = await supabase
      .from('xero_invoices')
      .select('*')
      .order('date', { ascending: false })
      .range(offset, offset + limit - 1);
      
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching invoices:', err);
    return [];
  }
}

// Fetch bills with pagination
export async function getBills(limit = 10, offset = 0): Promise<XeroBill[]> {
  try {
    const { data, error } = await supabase
      .from('xero_bills')
      .select('*')
      .order('date', { ascending: false })
      .range(offset, offset + limit - 1);
      
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching bills:', err);
    return [];
  }
}

// Fetch contacts with pagination
export async function getContacts(limit = 10, offset = 0): Promise<XeroContact[]> {
  try {
    const { data, error } = await supabase
      .from('xero_contacts')
      .select('*')
      .order('last_synced', { ascending: false })
      .range(offset, offset + limit - 1);
      
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching contacts:', err);
    return [];
  }
}

// Fetch transactions with pagination
export async function getTransactions(limit = 10, offset = 0): Promise<XeroTransaction[]> {
  try {
    const { data, error } = await supabase
      .from('xero_transactions')
      .select('*')
      .order('date', { ascending: false })
      .range(offset, offset + limit - 1);
      
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching transactions:', err);
    return [];
  }
}
