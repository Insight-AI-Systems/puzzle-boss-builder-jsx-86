
import { supabase } from '@/integrations/supabase/client';
import { Issue, IssueFormData, IssueStatus } from '@/types/issueTypes';

export async function fetchIssuesData() {
  const { data: issuesData, error } = await supabase
    .from('issues')
    .select(`
      *,
      creator:profiles!issues_created_by_fkey(username, email),
      modifier:profiles!issues_modified_by_fkey(username, email)
    `);

  if (error) throw error;
  return issuesData;
}

export async function createIssueRecord(issueData: IssueFormData, userId: string) {
  const { error } = await supabase
    .from('issues')
    .insert({
      ...issueData,
      created_by: userId,
      modified_by: userId,
      status: 'wip'
    });

  if (error) throw error;
}

export async function updateIssueRecord(id: string, issueData: Partial<IssueFormData>, userId: string) {
  const { error } = await supabase
    .from('issues')
    .update({
      ...issueData,
      modified_by: userId
    })
    .eq('id', id);

  if (error) throw error;
}

export async function updateIssueStatusRecord(id: string, status: IssueStatus, userId: string) {
  const { error } = await supabase
    .from('issues')
    .update({
      status,
      modified_by: userId
    })
    .eq('id', id);

  if (error) throw error;
}

export async function deleteIssueRecord(id: string) {
  const { error } = await supabase
    .from('issues')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
