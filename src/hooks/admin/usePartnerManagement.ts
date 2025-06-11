
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

export interface PartnerAgreement {
  id: string;
  partner_id: string;
  name: string;
  version: string;
  status: 'pending' | 'signed' | 'active' | 'expired' | 'terminated';
  document_url?: string;
  effective_from?: string;
  effective_to?: string;
  signed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PartnerProduct {
  id: string;
  partner_id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected';
  category_id?: string;
  shipping_info?: {
    origin?: string;
    weight?: string;
    dimensions?: string;
    notes?: string;
  };
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
      
      // Transform the data to match our Partner interface
      return (data || []).map(partner => ({
        ...partner,
        onboarding_stage: mapDbOnboardingStage(partner.onboarding_stage),
      })) as Partner[];
    },
    enabled: !!user
  });

  // Helper function to map database onboarding stages to our interface
  const mapDbOnboardingStage = (dbStage: string): Partner['onboarding_stage'] => {
    const stageMap: Record<string, Partner['onboarding_stage']> = {
      'invited': 'initial_contact',
      'registration_started': 'initial_contact',
      'registration_completed': 'proposal_sent',
      'documents_pending': 'contract_negotiation',
      'documents_submitted': 'contract_negotiation',
      'contract_sent': 'onboarding',
      'contract_signed': 'active',
      'approved': 'completed',
      'rejected': 'initial_contact'
    };
    return stageMap[dbStage] || 'initial_contact';
  };

  const addPartnerMutation = useMutation({
    mutationFn: async (partnerData: Omit<Partner, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('partners')
        .insert([{
          ...partnerData,
          // Map our onboarding stage back to database format
          onboarding_stage: mapOnboardingStageToDb(partnerData.onboarding_stage)
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
    }
  });

  const mapOnboardingStageToDb = (stage: Partner['onboarding_stage']): string => {
    const stageMap: Record<Partner['onboarding_stage'], string> = {
      'initial_contact': 'invited',
      'proposal_sent': 'registration_completed',
      'contract_negotiation': 'documents_pending',
      'onboarding': 'contract_sent',
      'active': 'contract_signed',
      'completed': 'approved'
    };
    return stageMap[stage] || 'invited';
  };

  const updatePartnerMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Partner> & { id: string }) => {
      const updateData = { ...updates };
      if (updateData.onboarding_stage) {
        updateData.onboarding_stage = mapOnboardingStageToDb(updateData.onboarding_stage) as any;
      }

      const { data, error } = await supabase
        .from('partners')
        .update(updateData)
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

  // Mock data and functions for features not yet implemented in database
  const agreements: PartnerAgreement[] = [];
  const products: PartnerProduct[] = [];
  const selectedPartner = partnerId ? partners?.find(p => p.id === partnerId) : null;

  const createAgreement = async (agreementData: any) => {
    console.log('Creating agreement:', agreementData);
    // TODO: Implement when agreements table is created
  };

  const updateAgreement = async (id: string, agreementData: any) => {
    console.log('Updating agreement:', id, agreementData);
    // TODO: Implement when agreements table is created
  };

  const createProduct = async (productData: any) => {
    console.log('Creating product:', productData);
    // TODO: Implement when products table is created
  };

  const updateProduct = async (id: string, productData: any) => {
    console.log('Updating product:', id, productData);
    // TODO: Implement when products table is created
  };

  const deleteProduct = async (id: string) => {
    console.log('Deleting product:', id);
    // TODO: Implement when products table is created
  };

  const createCommunication = async (communicationData: any) => {
    console.log('Creating communication:', communicationData);
    // TODO: Implement when communications table is created
  };

  return {
    partners,
    isLoading,
    error,
    addPartner: addPartnerMutation.mutate,
    updatePartner: updatePartnerMutation.mutate,
    deletePartner: deletePartnerMutation.mutate,
    isAddingPartner: addPartnerMutation.isPending,
    isUpdatingPartner: updatePartnerMutation.isPending,
    isDeletingPartner: deletePartnerMutation.isPending,
    // Additional functionality
    agreements,
    products,
    selectedPartner,
    createAgreement,
    updateAgreement,
    createProduct,
    updateProduct,
    deleteProduct,
    createCommunication
  };
};
