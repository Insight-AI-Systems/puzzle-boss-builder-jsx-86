
import React from 'react';
import { Issue } from '@/types/issueTypes';
import { IssueCard } from './IssueCard';

interface IssuesListProps {
  issues: Issue[];
  onUpdateStatus: (id: string, status: 'wip' | 'completed') => Promise<boolean>;
  onUpdateIssue: (id: string, data: { title: string; description: string; category?: string | null }) => Promise<boolean>;
  onDeleteIssue: (id: string) => Promise<boolean>;
}

export function IssuesList({ issues, onUpdateStatus, onUpdateIssue, onDeleteIssue }: IssuesListProps) {
  if (issues.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>No issues found. Create your first issue to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {issues.map(issue => (
        <IssueCard
          key={issue.id}
          issue={issue}
          onUpdateStatus={onUpdateStatus}
          onUpdateIssue={onUpdateIssue}
          onDeleteIssue={onDeleteIssue}
        />
      ))}
    </div>
  );
}
