
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, FilterX } from 'lucide-react';
import UsersList from './UsersList';
import UserDetailsSidebar from './UserDetailsSidebar';

/**
 * Component to manage the Users tab in the admin dashboard
 */
const UsersPanel = ({ users, profile, onRoleChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [selectedUser, setSelectedUser] = useState(null);

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }
    
    const filtered = users.filter(user => 
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  // Handle user selection for detailed view
  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };
  
  // Clear search and filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilteredUsers(users);
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
