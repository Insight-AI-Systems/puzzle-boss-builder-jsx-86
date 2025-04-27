
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SupportTicket, TicketFilters, TicketComment } from "@/types/supportTicketTypes";
import { mapDbStatusToFrontend } from "@/utils/support/mappings";

export const useUserTickets = () => {
  const fetchUserTickets = useCallback(async (
    userId: string | undefined,
    isAdmin: boolean,
    filters?: Partial<TicketFilters>
  ) => {
    const ticketsQuery = supabase
      .from('tickets')
      .select(`
        id, title, description, status, created_at, updated_at, created_by, comments
      `);
    
    if (!isAdmin && userId) {
      ticketsQuery.eq('created_by', userId);
    }
    
    ticketsQuery.order('created_at', { ascending: false });
    
    if (filters?.status) {
      ticketsQuery.eq('status', filters.status === 'pending' ? 'deferred' as any : filters.status as any);
    }
    
    if (filters?.search) {
      ticketsQuery.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }
    
    const { data: ticketsData, error: ticketsError } = await ticketsQuery;
    
    if (ticketsError) {
      console.error("Error fetching user tickets:", ticketsError);
      throw ticketsError;
    }
    
    if (!ticketsData || ticketsData.length === 0) {
      return [];
    }

    const creatorIds = [...new Set(ticketsData.map(item => item.created_by))];
    
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email')
      .in('id', creatorIds);
      
    if (profilesError) {
      console.error("Error fetching profiles for tickets:", profilesError);
      throw profilesError;
    }
    
    const userEmailMap = new Map();
    profilesData?.forEach(profile => {
      userEmailMap.set(profile.id, profile.email);
    });

    return ticketsData.map(item => {
      // Transform comments from Json[] to TicketComment[]
      const typedComments: TicketComment[] = Array.isArray(item.comments) 
        ? item.comments.map((comment: any) => ({
            id: comment.id || `comment-${Math.random().toString(36).substr(2, 9)}`,
            ticket_id: item.id,
            content: comment.content || '',
            created_by: comment.created_by || '',
            created_at: comment.created_at || new Date().toISOString(),
            is_staff: comment.is_staff || false
          }))
        : [];
      
      return {
        id: item.id,
        title: item.title,
        description: item.description,
        status: mapDbStatusToFrontend(item.status),
        priority: 'medium',
        category: 'tech',
        created_at: item.created_at,
        updated_at: item.updated_at,
        created_by: userEmailMap.get(item.created_by) || 'Unknown',
        comments: typedComments
      } as SupportTicket;
    });
  }, []);

  return { fetchUserTickets };
};
