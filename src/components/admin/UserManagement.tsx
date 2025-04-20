
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCog } from "lucide-react";
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';
import { UserRole, ROLE_DEFINITIONS } from '@/types/userTypes';
import { SearchBar } from './user-management/SearchBar';
import { UsersTable } from './user-management/UsersTable';

export function UserManagement() {
  const { allProfiles, isLoadingProfiles, updateUserRole, profile: currentUserProfile } = useUserProfile();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' }>({
    key: 'display_name',
    direction: 'ascending'
  });
  const { toast } = useToast();
  
  const currentUserRole = currentUserProfile?.role || 'player';

  // Handle sort request for a column
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort profiles based on search term and sort config
  const filteredAndSortedProfiles = useMemo(() => {
    if (!allProfiles) return [];
    
    let result = allProfiles.filter(profile => 
      profile.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    result.sort((a, b) => {
      if (sortConfig.key === 'display_name') {
        const aValue = a.display_name || '';
        const bValue = b.display_name || '';
        if (sortConfig.direction === 'ascending') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      } else if (sortConfig.key === 'role') {
        const aValue = ROLE_DEFINITIONS[a.role]?.label || a.role;
        const bValue = ROLE_DEFINITIONS[b.role]?.label || b.role;
        return sortConfig.direction === 'ascending' ? 
          aValue.localeCompare(bValue) : 
          bValue.localeCompare(aValue);
      } else if (sortConfig.key === 'credits') {
        const aValue = a.credits || 0;
        const bValue = b.credits || 0;
        return sortConfig.direction === 'ascending' ? 
          aValue - bValue : 
          bValue - aValue;
      } else if (sortConfig.key === 'created_at') {
        const aValue = new Date(a.created_at).getTime();
        const bValue = new Date(b.created_at).getTime();
        return sortConfig.direction === 'ascending' ? 
          aValue - bValue : 
          bValue - aValue;
      }
      return 0;
    });
    
    return result;
  }, [allProfiles, searchTerm, sortConfig]);

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    updateUserRole.mutate(
      { targetUserId: userId, newRole },
      {
        onSuccess: () => {
          toast({
            title: "Role updated",
            description: `User role has been updated to ${newRole}`,
            duration: 3000,
          });
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

  if (!allProfiles || allProfiles.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>No users found or you don't have permission to view users.</CardDescription>
        </CardHeader>
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
        <CardDescription>Manage user accounts and permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
        
        <UsersTable 
          users={filteredAndSortedProfiles}
          currentUserRole={currentUserRole}
          onRoleChange={handleRoleChange}
          sortConfig={sortConfig}
          onRequestSort={requestSort}
        />
      </CardContent>
    </Card>
  );
}
