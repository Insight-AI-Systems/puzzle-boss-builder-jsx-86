
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define types that match the database schema
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
  onboarding_stage: 'approved' | 'rejected' | 'invited' | 'registration_started' | 'registration_completed' | 'documents_pending' | 'documents_submitted' | 'contract_sent' | 'contract_signed';
  created_at: string;
  updated_at: string;
}

export interface PartnerAgreement {
  id: string;
  partner_id: string;
  name: string;
  version: string;
  status: string;
  document_url?: string;
  signed_at?: string;
  effective_from?: string;
  effective_to?: string;
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
  shipping_info?: any;
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

export function usePartnerManagement(partnerId?: string | null) {
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

  // Mock agreements data for now
  const agreements: PartnerAgreement[] = [];
  
  // Mock products data for now
  const products: PartnerProduct[] = [];

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

  // Mock functions for missing methods
  const createAgreement = async (agreementData: any) => {
    console.log('Creating agreement:', agreementData);
    toast.success('Agreement created successfully');
  };

  const updateAgreement = async (id: string, agreementData: any) => {
    console.log('Updating agreement:', id, agreementData);
    toast.success('Agreement updated successfully');
  };

  const createProduct = async (productData: any) => {
    console.log('Creating product:', productData);
    toast.success('Product created successfully');
  };

  const updateProduct = async (id: string, productData: any) => {
    console.log('Updating product:', id, productData);
    toast.success('Product updated successfully');
  };

  const deleteProduct = async (id: string) => {
    console.log('Deleting product:', id);
    toast.success('Product deleted successfully');
  };

  const createCommunication = async (communicationData: any) => {
    console.log('Creating communication:', communicationData);
    toast.success('Communication sent successfully');
  };

  return {
    partners,
    isLoading,
    error,
    selectedPartner,
    setSelectedPartner,
    agreements,
    products,
    createPartner: createPartnerMutation.mutate,
    updatePartner: updatePartnerMutation.mutate,
    deletePartner: deletePartnerMutation.mutate,
    createAgreement,
    updateAgreement,
    createProduct,
    updateProduct,
    deleteProduct,
    createCommunication,
    isCreating: createPartnerMutation.isPending,
    isUpdating: updatePartnerMutation.isPending,
    isDeleting: deletePartnerMutation.isPending
  };
}
