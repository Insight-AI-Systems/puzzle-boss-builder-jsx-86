
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Issue, IssueFormData, IssueStatus, IssueFilters } from '@/types/issueTypes';

export function useIssues() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<IssueFilters>({
    searchTerm: '',
    statusFilter: 'all',
    categoryFilter: 'all',
    sortBy: 'created_at',
    sortDirection: 'desc'
  });
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  const fetchIssues = async () => {
    if (!user || !isAdmin) return;

    setIsLoading(true);
    try {
      let query = supabase
        .from('issues')
        .select(`
          *,
          creator:profiles!issues_created_by_fkey(username, email),
          modifier:profiles!issues_modified_by_fkey(username, email)
        `);

      // Apply status filter
      if (filters.statusFilter !== 'all') {
        query = query.eq('status', filters.statusFilter);
      }

      // Apply category filter
      if (filters.categoryFilter !== 'all') {
        query = query.eq('category', filters.categoryFilter);
      }

      // Apply search term
      if (filters.searchTerm) {
        query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
      }

      // Apply sorting
      query = query.order(filters.sortBy, { ascending: filters.sortDirection === 'asc' });

      const { data: issuesData, error } = await query;

      if (error) throw error;

      // Format issues with creator and modifier names
      const formattedIssues: Issue[] = issuesData.map(issue => ({
        ...issue,
        creator_name: issue.creator?.username || issue.creator?.email || 'Unknown User',
        modifier_name: issue.modifier?.username || issue.modifier?.email || 'Unknown User'
      }));

      setIssues(formattedIssues);

      // Extract unique categories
      const categories = [...new Set(issuesData.filter(issue => issue.category).map(issue => issue.category))];
      setUniqueCategories(categories as string[]);
    } catch (error) {
      console.error('Error fetching issues:', error);
      toast({
        title: 'Error fetching issues',
        description: 'Unable to load issues. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createIssue = async (issueData: IssueFormData): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('issues')
        .insert({
          ...issueData,
          created_by: user.id,
          modified_by: user.id,
          status: 'wip'
        });

      if (error) throw error;

      toast({
        title: 'Issue created',
        description: 'New issue has been added successfully.'
      });
      
      fetchIssues();
      return true;
    } catch (error) {
      console.error('Error creating issue:', error);
      toast({
        title: 'Error creating issue',
        description: 'Unable to create the issue. Please try again.',
        variant: 'destructive'
      });
      return false;
    }
  };

  const updateIssue = async (id: string, issueData: Partial<IssueFormData>): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('issues')
        .update({
          ...issueData,
          modified_by: user.id
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Issue updated',
        description: 'The issue has been updated successfully.'
      });
      
      fetchIssues();
      return true;
    } catch (error) {
      console.error('Error updating issue:', error);
      toast({
        title: 'Error updating issue',
        description: 'Unable to update the issue. Please try again.',
        variant: 'destructive'
      });
      return false;
    }
  };

  const updateIssueStatus = async (id: string, status: IssueStatus): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('issues')
        .update({
          status,
          modified_by: user.id
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Status updated',
        description: `Issue marked as ${status === 'wip' ? 'Work In Progress' : 'Completed'}.`
      });
      
      fetchIssues();
      return true;
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error updating status',
        description: 'Unable to update the status. Please try again.',
        variant: 'destructive'
      });
      return false;
    }
  };

  const deleteIssue = async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('issues')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Issue deleted',
        description: 'The issue has been deleted successfully.'
      });
      
      fetchIssues();
      return true;
    } catch (error) {
      console.error('Error deleting issue:', error);
      toast({
        title: 'Error deleting issue',
        description: 'Unable to delete the issue. Please try again.',
        variant: 'destructive'
      });
      return false;
    }
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchIssues();

      // Set up realtime subscription for issues table
      const channel = supabase
        .channel('issues-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'issues' },
          () => fetchIssues()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, isAdmin, filters]);

  return {
    issues,
    isLoading,
    filters,
    setFilters,
    uniqueCategories,
    createIssue,
    updateIssue,
    updateIssueStatus,
    deleteIssue
  };
}
