
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useClerkAuth } from '@/hooks/useClerkAuth';

export interface Partner {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  website?: string;
  address?: string;
  description?: string;
  status: 'prospect' | 'active' | 'inactive' | 'suspended';
  onboarding_stage: 'initial_contact' | 'proposal_sent' | 'contract_negotiation' | 'onboarding' | 'active' | 'completed';
  created_at: string;
  updated_at: string;
}

export const usePartnerManagement = (partnerId?: string | null) => {
  const { user } = useClerkAuth();
  const queryClient = useQueryClient();

  const { data: partners, isLoading, error } = useQuery({
    queryKey: ['partners', partnerId],
    queryFn: async () => {
      let query = supabase.from('partners').select('*');
      
      if (partnerId) {
        query = query.eq('id', partnerId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Partner[];
    },
    enabled: !!user
  });

  const addPartnerMutation = useMutation({
    mutationFn: async (partnerData: Omit<Partner, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('partners')
        .insert([partnerData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
    }
  });

  const updatePartnerMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Partner> & { id: string }) => {
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
    }
  });

  return {
    partners,
    isLoading,
    error,
    addPartner: addPartnerMutation.mutate,
    updatePartner: updatePartnerMutation.mutate,
    deletePartner: deletePartnerMutation.mutate,
    isAddingPartner: addPartnerMutation.isPending,
    isUpdatingPartner: updatePartnerMutation.isPending,
    isDeletingPartner: deletePartnerMutation.isPending
  };
};
