
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define types that match the database schema
interface Partner {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  website?: string;
  address?: string;
  description?: string;
  status: 'prospect' | 'active' | 'inactive' | 'suspended';
  // Use the correct onboarding stage values from the database
  onboarding_stage: 'approved' | 'rejected' | 'invited' | 'registration_started' | 'registration_completed' | 'documents_pending' | 'documents_submitted' | 'contract_sent' | 'contract_signed';
  created_at: string;
  updated_at: string;
}

interface CreatePartnerData {
  company_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  website?: string;
  address?: string;
  description?: string;
  status?: 'prospect' | 'active' | 'inactive' | 'suspended';
  onboarding_stage?: 'approved' | 'rejected' | 'invited' | 'registration_started' | 'registration_completed' | 'documents_pending' | 'documents_submitted' | 'contract_sent' | 'contract_signed';
}

export function usePartnerManagement() {
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const queryClient = useQueryClient();

  const {
    data: partners = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Partner[];
    }
  });

  const createPartnerMutation = useMutation({
    mutationFn: async (partnerData: CreatePartnerData) => {
      const { data, error } = await supabase
        .from('partners')
        .insert([{
          ...partnerData,
          onboarding_stage: partnerData.onboarding_stage || 'invited',
          status: partnerData.status || 'prospect'
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      toast.success('Partner created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create partner: ${error.message}`);
    }
  });

  const updatePartnerMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CreatePartnerData> }) => {
      const { data, error } = await supabase
        .from('partners')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      toast.success('Partner updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update partner: ${error.message}`);
    }
  });

  const deletePartnerMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      toast.success('Partner deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete partner: ${error.message}`);
    }
  });

  return {
    partners,
    isLoading,
    error,
    selectedPartner,
    setSelectedPartner,
    createPartner: createPartnerMutation.mutate,
    updatePartner: updatePartnerMutation.mutate,
    deletePartner: deletePartnerMutation.mutate,
    isCreating: createPartnerMutation.isPending,
    isUpdating: updatePartnerMutation.isPending,
    isDeleting: deletePartnerMutation.isPending
  };
}
