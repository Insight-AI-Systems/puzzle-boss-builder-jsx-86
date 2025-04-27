
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SupportTicket, TicketComment } from "@/types/supportTicketTypes";
import { mapDbStatusToFrontend } from "@/utils/support/mappings";

export const useInternalIssues = () => {
  const fetchInternalIssues = useCallback(async () => {
    const { data: issuesData, error: issuesError } = await supabase
      .from('issues')
      .select(`
        id, title, description, status, category, created_at, updated_at, created_by
      `)
      .eq('category', 'internal')
      .order('created_at', { ascending: false });
      
    if (issuesError) {
      console.error("Error fetching internal issues:", issuesError);
      throw issuesError;
    }
    
    if (!issuesData || issuesData.length === 0) {
      return [];
    }

    const creatorIds = [...new Set(issuesData.map(item => item.created_by))];
    
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email')
      .in('id', creatorIds);
      
    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      throw profilesError;
    }
    
    const userEmailMap = new Map();
    profilesData?.forEach(profile => {
      userEmailMap.set(profile.id, profile.email);
    });
    
    return issuesData.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      status: mapDbStatusToFrontend(item.status),
      priority: (item.category === 'security' ? 'high' : 
                item.category === 'feature' ? 'low' : 'medium'),
      category: 'internal',
      created_at: item.created_at,
      updated_at: item.updated_at,
      created_by: userEmailMap.get(item.created_by) || 'Unknown',
      comments: [] as TicketComment[]
    } as SupportTicket));
  }, []);

  return { fetchInternalIssues };
};
