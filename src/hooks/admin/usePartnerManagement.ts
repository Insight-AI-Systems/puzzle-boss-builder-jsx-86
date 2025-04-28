
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Partner {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  status: 'prospect' | 'active' | 'inactive' | 'suspended';
  onboarding_stage: string;
  website: string | null;
  tax_id: string | null;
  description: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  assigned_to: string | null;
  metadata: any;
}

export interface PartnerProduct {
  id: string;
  partner_id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  images: any[];
  shipping_info: any;
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected';
  category_id: string | null;
  created_at: string;
  updated_at: string;
  metadata: any;
}

export interface PartnerCommunication {
  id: string;
  partner_id: string;
  type: 'email' | 'call' | 'meeting' | 'note';
  subject: string;
  content: string;
  sent_by: string | null;
  sent_at: string;
  metadata: any;
}

export interface PartnerAgreement {
  id: string;
  partner_id: string;
  name: string;
  version: string;
  document_url: string | null;
  status: string;
  signed_at: string | null;
  effective_from: string | null;
  effective_to: string | null;
  created_at: string;
  updated_at: string;
  metadata: any;
}

interface UsePartnerManagementReturn {
  partners: Partner[] | null;
  selectedPartner: Partner | null;
  products: PartnerProduct[] | null;
  communications: PartnerCommunication[] | null;
  agreements: PartnerAgreement[] | null;
  isLoading: boolean;
  isLoadingDetails: boolean;
  error: string | null;
  createPartner: (partner: Partial<Partner>) => void;
  updatePartner: (id: string, partner: Partial<Partner>) => void;
  deletePartner: (id: string) => void;
  createProduct: (product: Partial<PartnerProduct>) => void;
  updateProduct: (id: string, product: Partial<PartnerProduct>) => void;
  deleteProduct: (id: string) => void;
  createCommunication: (communication: Partial<PartnerCommunication>) => void;
  createAgreement: (agreement: Partial<PartnerAgreement>) => void;
  updateAgreement: (id: string, agreement: Partial<PartnerAgreement>) => void;
}

export function usePartnerManagement(
  selectedPartnerId: string | null
): UsePartnerManagementReturn {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  // Query to fetch all partners
  const {
    data: partners,
    isLoading,
    error: partnersError
  } = useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('company_name');

      if (error) throw new Error(error.message);
      return data;
    }
  });

  // Query to fetch selected partner details
  const {
    data: selectedPartner,
    isLoading: isLoadingDetails,
    error: partnerDetailsError
  } = useQuery({
    queryKey: ['partner', selectedPartnerId],
    queryFn: async () => {
      if (!selectedPartnerId) return null;
      
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('id', selectedPartnerId)
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!selectedPartnerId
  });

  // Query to fetch partner products
  const {
    data: products,
    error: productsError
  } = useQuery({
    queryKey: ['partner-products', selectedPartnerId],
    queryFn: async () => {
      if (!selectedPartnerId) return null;

      const { data, error } = await supabase
        .from('partner_products')
        .select('*')
        .eq('partner_id', selectedPartnerId)
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!selectedPartnerId
  });

  // Query to fetch partner communications
  const {
    data: communications,
    error: communicationsError
  } = useQuery({
    queryKey: ['partner-communications', selectedPartnerId],
    queryFn: async () => {
      if (!selectedPartnerId) return null;

      const { data, error } = await supabase
        .from('partner_communications')
        .select('*')
        .eq('partner_id', selectedPartnerId)
        .order('sent_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!selectedPartnerId
  });

  // Query to fetch partner agreements
  const {
    data: agreements,
    error: agreementsError
  } = useQuery({
    queryKey: ['partner-agreements', selectedPartnerId],
    queryFn: async () => {
      if (!selectedPartnerId) return null;

      const { data, error } = await supabase
        .from('partner_agreements')
        .select('*')
        .eq('partner_id', selectedPartnerId)
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!selectedPartnerId
  });

  // Handle any errors from queries
  useEffect(() => {
    const errors = [
      partnersError, 
      partnerDetailsError, 
      productsError, 
      communicationsError,
      agreementsError
    ].filter(Boolean);
    
    if (errors.length > 0) {
      setError(errors[0]?.message || 'An error occurred');
    } else {
      setError(null);
    }
  }, [partnersError, partnerDetailsError, productsError, communicationsError, agreementsError]);

  // Mutation to create a partner
  const createPartnerMutation = useMutation({
    mutationFn: async (newPartner: Partial<Partner>) => {
      const { data, error } = await supabase
        .from('partners')
        .insert(newPartner)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Partner created",
        description: "The partner has been successfully created.",
      });
      queryClient.invalidateQueries({ queryKey: ['partners'] });
    },
    onError: (error) => {
      console.error('Error creating partner:', error);
      toast({
        title: "Failed to create partner",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Mutation to update a partner
  const updatePartnerMutation = useMutation({
    mutationFn: async ({ id, partner }: { id: string, partner: Partial<Partner> }) => {
      const { data, error } = await supabase
        .from('partners')
        .update(partner)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Partner updated",
        description: "The partner information has been updated."
      });
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      queryClient.invalidateQueries({ queryKey: ['partner', selectedPartnerId] });
    },
    onError: (error) => {
      console.error('Error updating partner:', error);
      toast({
        title: "Failed to update partner",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Mutation to delete a partner
  const deletePartnerMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Partner deleted",
        description: "The partner has been removed from the system."
      });
      queryClient.invalidateQueries({ queryKey: ['partners'] });
    },
    onError: (error) => {
      console.error('Error deleting partner:', error);
      toast({
        title: "Failed to delete partner",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Mutation to create a product
  const createProductMutation = useMutation({
    mutationFn: async (newProduct: Partial<PartnerProduct>) => {
      const { data, error } = await supabase
        .from('partner_products')
        .insert(newProduct)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Product created",
        description: "The product has been successfully created."
      });
      queryClient.invalidateQueries({ queryKey: ['partner-products', selectedPartnerId] });
    },
    onError: (error) => {
      console.error('Error creating product:', error);
      toast({
        title: "Failed to create product",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Mutation to update a product
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, product }: { id: string, product: Partial<PartnerProduct> }) => {
      const { data, error } = await supabase
        .from('partner_products')
        .update(product)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Product updated",
        description: "The product information has been updated."
      });
      queryClient.invalidateQueries({ queryKey: ['partner-products', selectedPartnerId] });
    },
    onError: (error) => {
      console.error('Error updating product:', error);
      toast({
        title: "Failed to update product",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Mutation to delete a product
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('partner_products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Product deleted",
        description: "The product has been removed from the system."
      });
      queryClient.invalidateQueries({ queryKey: ['partner-products', selectedPartnerId] });
    },
    onError: (error) => {
      console.error('Error deleting product:', error);
      toast({
        title: "Failed to delete product",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Mutation to create a communication
  const createCommunicationMutation = useMutation({
    mutationFn: async (newCommunication: Partial<PartnerCommunication>) => {
      const { data, error } = await supabase
        .from('partner_communications')
        .insert(newCommunication)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Communication recorded",
        description: "The communication has been recorded successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['partner-communications', selectedPartnerId] });
    },
    onError: (error) => {
      console.error('Error creating communication:', error);
      toast({
        title: "Failed to record communication",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Mutation to create an agreement
  const createAgreementMutation = useMutation({
    mutationFn: async (newAgreement: Partial<PartnerAgreement>) => {
      const { data, error } = await supabase
        .from('partner_agreements')
        .insert(newAgreement)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Agreement created",
        description: "The agreement has been created successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['partner-agreements', selectedPartnerId] });
    },
    onError: (error) => {
      console.error('Error creating agreement:', error);
      toast({
        title: "Failed to create agreement",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Mutation to update an agreement
  const updateAgreementMutation = useMutation({
    mutationFn: async ({ id, agreement }: { id: string, agreement: Partial<PartnerAgreement> }) => {
      const { data, error } = await supabase
        .from('partner_agreements')
        .update(agreement)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Agreement updated",
        description: "The agreement has been updated successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['partner-agreements', selectedPartnerId] });
    },
    onError: (error) => {
      console.error('Error updating agreement:', error);
      toast({
        title: "Failed to update agreement",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    partners,
    selectedPartner,
    products,
    communications,
    agreements,
    isLoading,
    isLoadingDetails,
    error,
    createPartner: (partner) => createPartnerMutation.mutate(partner),
    updatePartner: (id, partner) => updatePartnerMutation.mutate({ id, partner }),
    deletePartner: (id) => deletePartnerMutation.mutate(id),
    createProduct: (product) => createProductMutation.mutate(product),
    updateProduct: (id, product) => updateProductMutation.mutate({ id, product }),
    deleteProduct: (id) => deleteProductMutation.mutate(id),
    createCommunication: (communication) => createCommunicationMutation.mutate(communication),
    createAgreement: (agreement) => createAgreementMutation.mutate(agreement),
    updateAgreement: (id, agreement) => updateAgreementMutation.mutate({ id, agreement })
  };
}
