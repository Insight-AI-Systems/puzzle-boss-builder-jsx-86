
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useIssues } from '@/hooks/useIssues';
import { NewIssueDialog } from '@/components/issues/NewIssueDialog';
import { IssueFiltersComponent } from '@/components/issues/IssueFilters';
import { IssuesList } from '@/components/issues/IssuesList';

export default function KnownIssues() {
  const {
    issues,
    isLoading,
    filters,
    setFilters,
    uniqueCategories,
    createIssue,
    updateIssue,
    updateIssueStatus,
    deleteIssue
  } = useIssues();

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <ProtectedRoute requiredRoles={['admin', 'super_admin']}>
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-game text-puzzle-aqua">Known Issues</h1>
            <p className="text-muted-foreground">
              Track and manage known issues and their resolutions
            </p>
          </div>
          <NewIssueDialog onCreateIssue={createIssue} />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Issues Tracker</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <IssueFiltersComponent 
              filters={filters} 
              onFilterChange={handleFilterChange} 
              categories={uniqueCategories}
            />
            
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-puzzle-aqua" />
              </div>
            ) : (
              <IssuesList 
                issues={issues} 
                onUpdateStatus={updateIssueStatus}
                onUpdateIssue={updateIssue}
                onDeleteIssue={deleteIssue}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
