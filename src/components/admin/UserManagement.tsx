import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCog } from "lucide-react";
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types/userTypes';
import { SearchBar } from './user-management/SearchBar';
import { UsersTable } from './user-management/UsersTable';
import { Button } from '@/components/ui/button';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

export function UserManagement() {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 10;
  
  const { 
    allProfiles, 
    isLoadingProfiles, 
    updateUserRole, 
    profile: currentUserProfile,
    refetch 
  } = useUserProfile({
    page,
    pageSize,
    searchTerm
  });
  
  const { toast } = useToast();
  const currentUserRole = currentUserProfile?.role || 'player';
  const totalPages = Math.ceil((allProfiles?.count || 0) / pageSize);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    updateUserRole.mutate(
      { targetUserId: userId, newRole },
      {
        onSuccess: () => {
          toast({
            title: "Role updated",
            description: `User role has been updated to ${newRole}`,
            duration: 3000,
          });
          refetch();
        },
        onError: (error) => {
          toast({
            title: "Role update failed",
            description: `Error: ${error instanceof Error ? error.message : 'You do not have permission to update this role.'}`,
            variant: 'destructive',
            duration: 5000,
          });
        }
      }
    );
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(0); // Reset to first page when searching
  };

  if (isLoadingProfiles) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Loading user data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-puzzle-aqua"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserCog className="h-5 w-5 mr-2" />
          User Management
        </CardTitle>
        <CardDescription>
          Search users by email or name to manage their roles. New users will be automatically added to the system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <SearchBar 
            value={searchTerm} 
            onChange={handleSearch} 
            placeholder="Search by email or name..."
          />
          
          <UsersTable 
            users={allProfiles?.data || []}
            currentUserRole={currentUserRole}
            onRoleChange={handleRoleChange}
          />
          
          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="gap-1 pl-2.5"
                  >
                    <span>Previous</span>
                  </Button>
                </PaginationItem>
                <PaginationItem className="flex items-center">
                  <span className="text-sm">
                    Page {page + 1} of {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="gap-1 pr-2.5"
                  >
                    <span>Next</span>
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
