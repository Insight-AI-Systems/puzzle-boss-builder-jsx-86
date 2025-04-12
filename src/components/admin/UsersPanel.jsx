
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, FilterX } from 'lucide-react';
import UsersList from './UsersList';
import UserDetailsSidebar from './UserDetailsSidebar';

/**
 * Component to manage the Users tab in the admin dashboard
 * Optimized to minimize data processing and rendering
 */
const UsersPanel = ({ users, profile, onRoleChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Only pass minimal required data to child components
  const minimalUsers = useMemo(() => {
    return users.map(user => ({
      id: user.id,
      username: user.username || 'No username',
      role: user.role,
      created_at: user.created_at
    }));
  }, [users]);
  
  // Use useMemo for filtering to reduce unnecessary processing
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) {
      return minimalUsers;
    }
    
    const searchLower = searchTerm.toLowerCase();
    return minimalUsers.filter(user => 
      (user.username && user.username.toLowerCase().includes(searchLower)) ||
      (user.role && user.role.toLowerCase().includes(searchLower))
    );
  }, [searchTerm, minimalUsers]);

  // Handle user selection with only required data
  const handleSelectUser = (user) => {
    // Find full user data but only extract needed fields
    const fullUser = users.find(u => u.id === user.id);
    if (fullUser) {
      setSelectedUser({
        id: fullUser.id,
        username: fullUser.username,
        role: fullUser.role,
        created_at: fullUser.created_at
      });
    }
  };
  
  const clearFilters = () => {
    setSearchTerm('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* User List */}
      <div className="md:col-span-2">
        <Card className="bg-puzzle-black border-puzzle-aqua/30">
          <CardHeader>
            <CardTitle className="text-puzzle-white">Users</CardTitle>
            <CardDescription>Manage user accounts and roles</CardDescription>
            
            <div className="flex items-center mt-4 space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name or role..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={clearFilters}
                className="border-puzzle-aqua/50 text-puzzle-aqua hover:bg-puzzle-aqua/10"
              >
                <FilterX size={16} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <UsersList 
              users={filteredUsers}
              selectedUser={selectedUser}
              onSelectUser={handleSelectUser}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* User Details */}
      <div className="md:col-span-1">
        <UserDetailsSidebar
          selectedUser={selectedUser}
          profile={profile}
          onRoleChange={onRoleChange}
          onClose={() => setSelectedUser(null)}
        />
      </div>
    </div>
  );
};

export default UsersPanel;
