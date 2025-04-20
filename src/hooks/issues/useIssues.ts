
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Issue, IssueFormData, IssueStatus, IssueWithProfiles } from '@/types/issueTypes';
import { supabase } from '@/integrations/supabase/client';
import { useIssuesFilters } from './useIssuesFilters';
import {
  fetchIssuesData,
  createIssueRecord,
  updateIssueRecord,
  updateIssueStatusRecord,
  deleteIssueRecord
} from '@/api/issuesApi';

export function useIssues() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const { filters, updateFilters, uniqueCategories, setUniqueCategories } = useIssuesFilters();

  const fetchIssues = async () => {
    if (!user || !isAdmin) return;

    setIsLoading(true);
    try {
      const issuesData = await fetchIssuesData();
      
      const formattedIssues: Issue[] = (issuesData as IssueWithProfiles[]).map(issue => ({
        ...issue,
        creator_name: issue.creator?.username || issue.creator?.email || 'Unknown User',
        modifier_name: issue.modifier?.username || issue.modifier?.email || 'Unknown User'
      }));

      setIssues(formattedIssues);

      const categories = [...new Set(issuesData
        .filter(issue => issue.category)
        .map(issue => issue.category as string)
      )];
      
      setUniqueCategories(categories);
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
      await createIssueRecord(issueData, user.id);
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
      await updateIssueRecord(id, issueData, user.id);
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
      await updateIssueStatusRecord(id, status, user.id);
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
      await deleteIssueRecord(id);
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
    setFilters: updateFilters,
    uniqueCategories,
    createIssue,
    updateIssue,
    updateIssueStatus,
    deleteIssue
  };
}
