
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { 
  ROLES, 
  PERMISSIONS, 
  getRoleDisplayName, 
  hasPermission 
} from '@/utils/permissions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Loading from '@/components/ui/loading';
import { useToast } from '@/components/ui/use-toast';
import { ShieldCheck, User, Users, Search, FilterX } from 'lucide-react';

/**
 * Admin dashboard for user management and role assignments
 */
const AdminDashboard = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const { toast } = useToast();

  // Fetch users from the database
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        setUsers(data || []);
        setFilteredUsers(data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: 'Error',
          description: 'Failed to load users. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [toast]);
  
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
  
  // Handle role change
  const handleRoleChange = async (userId, newRole) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)
        .select();
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      
      setFilteredUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, role: newRole });
      }
      
      toast({
        title: 'Role Updated',
        description: `User role has been updated to ${getRoleDisplayName(newRole)}`,
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role. Please try again.',
        variant: 'destructive'
      });
    }
  };
  
  // Handle user selection for detailed view
  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };
  
  // Clear search and filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilteredUsers(users);
  };
  
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-puzzle-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-puzzle-white">Admin Dashboard</h1>
          <Badge className="bg-puzzle-gold text-puzzle-black">
            {getRoleDisplayName(profile?.role)}
          </Badge>
        </div>
        
        <Tabs defaultValue="users" onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8 bg-puzzle-black border border-puzzle-aqua/30">
            <TabsTrigger value="users" className="text-puzzle-white data-[state=active]:bg-puzzle-aqua/20">
              <Users className="mr-2 h-4 w-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="roles" className="text-puzzle-white data-[state=active]:bg-puzzle-aqua/20">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Role Permissions
            </TabsTrigger>
          </TabsList>
          
          {/* Users Tab */}
          <TabsContent value="users">
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
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                              <TableRow 
                                key={user.id}
                                className={`cursor-pointer ${selectedUser?.id === user.id ? 'bg-puzzle-aqua/10' : ''}`}
                                onClick={() => handleSelectUser(user)}
                              >
                                <TableCell className="font-medium">{user.username || 'No username'}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="border-puzzle-gold text-puzzle-gold">
                                    {getRoleDisplayName(user.role)}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {new Date(user.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSelectUser(user);
                                    }}
                                    className="bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/90"
                                  >
                                    Details
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-8">
                                No users found matching your search criteria.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* User Details */}
              <div className="md:col-span-1">
                {selectedUser ? (
                  <Card className="bg-puzzle-black border-puzzle-aqua/30">
                    <CardHeader>
                      <CardTitle className="text-puzzle-white">User Details</CardTitle>
                      <CardDescription>View and edit user information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col items-center space-y-2 mb-4">
                        <div className="h-20 w-20 rounded-full bg-puzzle-aqua/20 flex items-center justify-center">
                          {selectedUser.avatar_url ? (
                            <img
                              src={selectedUser.avatar_url}
                              alt="User avatar"
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            <User size={40} className="text-puzzle-aqua" />
                          )}
                        </div>
                        <h3 className="text-lg font-medium text-puzzle-white">
                          {selectedUser.username || 'No username'}
                        </h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-muted-foreground text-sm mb-1 block">
                            User ID
                          </label>
                          <Input 
                            value={selectedUser.id} 
                            disabled 
                            className="bg-puzzle-black/50"
                          />
                        </div>
                        
                        <div>
                          <label className="text-muted-foreground text-sm mb-1 block">
                            Credits
                          </label>
                          <Input 
                            value={selectedUser.credits || 0} 
                            disabled 
                            className="bg-puzzle-black/50"
                          />
                        </div>
                        
                        <div>
                          <label className="text-muted-foreground text-sm mb-1 block">
                            Joined
                          </label>
                          <Input 
                            value={new Date(selectedUser.created_at).toLocaleString()} 
                            disabled 
                            className="bg-puzzle-black/50"
                          />
                        </div>
                        
                        <div>
                          <label className="text-muted-foreground text-sm mb-1 block">
                            Last Updated
                          </label>
                          <Input 
                            value={new Date(selectedUser.updated_at).toLocaleString()} 
                            disabled 
                            className="bg-puzzle-black/50"
                          />
                        </div>
                        
                        <div>
                          <label className="text-muted-foreground text-sm mb-1 block">
                            Role
                          </label>
                          <Select
                            defaultValue={selectedUser.role}
                            onValueChange={(value) => handleRoleChange(selectedUser.id, value)}
                            disabled={!hasPermission(profile, PERMISSIONS.MANAGE_ROLES)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                              {profile?.role === ROLES.SUPER_ADMIN && (
                                <SelectItem value={ROLES.SUPER_ADMIN}>
                                  Super Admin
                                </SelectItem>
                              )}
                              <SelectItem value={ROLES.ADMIN}>Admin</SelectItem>
                              <SelectItem value={ROLES.CATEGORY_MANAGER}>
                                Category Manager
                              </SelectItem>
                              <SelectItem value={ROLES.CFO}>CFO</SelectItem>
                              <SelectItem value={ROLES.SOCIAL_MEDIA_MANAGER}>
                                Social Media Manager
                              </SelectItem>
                              <SelectItem value={ROLES.PARTNER_MANAGER}>
                                Partner Manager
                              </SelectItem>
                              <SelectItem value={ROLES.PLAYER}>Player</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline"
                        onClick={() => setSelectedUser(null)}
                        className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10"
                      >
                        Close
                      </Button>
                    </CardFooter>
                  </Card>
                ) : (
                  <Card className="bg-puzzle-black border-puzzle-aqua/30 h-full flex flex-col justify-center items-center py-8">
                    <CardContent className="text-center">
                      <User size={48} className="mx-auto text-puzzle-aqua/50 mb-4" />
                      <p className="text-muted-foreground">
                        Select a user to view details and manage their role
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Roles Tab */}
          <TabsContent value="roles">
            <Card className="bg-puzzle-black border-puzzle-aqua/30">
              <CardHeader>
                <CardTitle className="text-puzzle-white">Role Permissions</CardTitle>
                <CardDescription>View permissions for each role</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Role</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Permissions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Super Admin</TableCell>
                        <TableCell>Full system access with ability to manage all aspects of the platform</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {/* Display all permissions */}
                            <Badge className="bg-puzzle-gold text-puzzle-black">All Permissions</Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Admin</TableCell>
                        <TableCell>Manage users, puzzles, and content, but cannot change system settings</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="border-puzzle-aqua text-puzzle-aqua">Manage Users</Badge>
                            <Badge variant="outline" className="border-puzzle-aqua text-puzzle-aqua">Manage Puzzles</Badge>
                            <Badge variant="outline" className="border-puzzle-aqua text-puzzle-aqua">Manage Categories</Badge>
                            <Badge variant="outline" className="border-puzzle-aqua text-puzzle-aqua">Manage Content</Badge>
                            <Badge variant="outline" className="border-puzzle-aqua text-puzzle-aqua">View Reports</Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Category Manager</TableCell>
                        <TableCell>Manage specific puzzle categories and their content</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="border-puzzle-aqua text-puzzle-aqua">Manage Categories</Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">CFO</TableCell>
                        <TableCell>Manage financial aspects and view reports</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="border-puzzle-aqua text-puzzle-aqua">Manage Finances</Badge>
                            <Badge variant="outline" className="border-puzzle-aqua text-puzzle-aqua">View Reports</Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Social Media Manager</TableCell>
                        <TableCell>Manage marketing and winner spotlights</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="border-puzzle-aqua text-puzzle-aqua">Manage Marketing</Badge>
                            <Badge variant="outline" className="border-puzzle-aqua text-puzzle-aqua">Manage Winners</Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Partner Manager</TableCell>
                        <TableCell>Manage prize suppliers and partnerships</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="border-puzzle-aqua text-puzzle-aqua">Manage Partners</Badge>
                            <Badge variant="outline" className="border-puzzle-aqua text-puzzle-aqua">Manage Prizes</Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Player</TableCell>
                        <TableCell>Standard user with basic gameplay access</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="border-puzzle-aqua text-puzzle-aqua">Play Puzzles</Badge>
                            <Badge variant="outline" className="border-puzzle-aqua text-puzzle-aqua">Manage Profile</Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
