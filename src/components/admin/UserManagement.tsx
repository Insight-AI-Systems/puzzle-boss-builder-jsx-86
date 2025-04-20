import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCog } from "lucide-react";
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types/userTypes';
import { SearchBar } from './user-management/SearchBar';
import { UsersTable } from './user-management/UsersTable';
import { UserTableFilters } from './user-management/UserTableFilters';
import { Button } from '@/components/ui/button';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { DateRange } from 'react-day-picker';

export function UserManagement() {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [roleSortDirection, setRoleSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const pageSize = 10;
  
  const { 
    allProfiles, 
    isLoadingProfiles, 
    updateUserRole, 
    profile: currentUserProfile,
    error: profileError,
    refetch 
  } = useUserProfile({
    page,
    pageSize,
    searchTerm,
    dateRange,
    // Temporarily disable these filters until columns exist
    // country: selectedCountry,
    // category: selectedCategory,
    role: selectedRole,
    roleSortDirection
  });
  
  const { toast } = useToast();
  const currentUserRole = currentUserProfile?.role || 'player';
  const totalPages = Math.ceil((allProfiles?.count || 0) / pageSize);

  // Get unique countries and categories - will be empty arrays until columns exist
  const countries: string[] = [];
  const categories: string[] = [];

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
    setPage(0);
    
    if (term) {
      toast({
        title: "Searching users",
        description: `Searching for "${term}" in user records...`,
        duration: 2000,
      });
    }
  };

  const handleSortByRole = () => {
    setRoleSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
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
  
  if (profileError) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Error loading users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 border border-red-300 bg-red-50 text-red-800 rounded-md">
            <h3 className="font-bold mb-2">Error fetching user data</h3>
            <p>{profileError instanceof Error ? profileError.message : 'An unknown error occurred'}</p>
            <Button 
              onClick={() => refetch()} 
              className="mt-4 bg-red-600 hover:bg-red-700"
            >
              Try Again
            </Button>
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
          Search and filter users by various criteria. For exact email matches, enter the complete email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search by email or name..."
          />
          
          <UserTableFilters
            onDateRangeChange={setDateRange}
            onCountryChange={setSelectedCountry}
            onCategoryChange={setSelectedCategory}
            onRoleChange={setSelectedRole}
            countries={countries}
            categories={categories}
            dateRange={dateRange}
          />
          
          <UsersTable 
            users={allProfiles?.data || []}
            currentUserRole={currentUserRole}
            onRoleChange={handleRoleChange}
            onSortByRole={handleSortByRole}
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
