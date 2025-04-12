
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from '@/components/ui/loading';
import { useToast } from '@/components/ui/use-toast';
import { ShieldCheck, Users } from 'lucide-react';
import { getRoleDisplayName } from '@/utils/permissions';
import UsersPanel from '@/components/admin/UsersPanel';
import RolePermissionsTable from '@/components/admin/RolePermissionsTable';

/**
 * Admin dashboard for user management and role assignments
 * Optimized to reduce render size and improve performance
 */
const AdminDashboard = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [loadedTabs, setLoadedTabs] = useState(['users']);

  // Fetch users from the database - optimized to limit initial fetch
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Further limit initial fetch to just 25 users to reduce payload size
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, role, created_at')
          .order('created_at', { ascending: false })
          .limit(25); // Reduced from 50 to 25
          
        if (error) {
          throw error;
        }
        
        // Ensure we only store necessary fields
        const streamlinedData = data?.map(user => ({
          id: user.id,
          username: user.username,
          role: user.role,
          created_at: user.created_at
        })) || [];
        
        setUsers(streamlinedData);
      } catch (error) {
        console.error('Error fetching users:', error.message?.substring(0, 200) || 'Unknown error');
        toast({
          title: 'Error',
          description: 'Failed to load users. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [toast, activeTab]);
  
  // Lazy load tab content to prevent loading all components at once
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (!loadedTabs.includes(tab)) {
      setLoadedTabs([...loadedTabs, tab]);
    }
  };
  
  // Handle role change with optimized update approach
  const handleRoleChange = async (userId, newRole) => {
    try {
      // Streamline data update by only selecting essential fields
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      
      toast({
        title: 'Role Updated',
        description: `User role has been updated to ${getRoleDisplayName(newRole)}`,
      });
    } catch (error) {
      console.error('Error updating role:', error.message?.substring(0, 200) || 'Unknown error');
      toast({
        title: 'Error',
        description: 'Failed to update user role. Please try again.',
        variant: 'destructive'
      });
    }
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
        
        <Tabs defaultValue="users" onValueChange={handleTabChange} className="w-full">
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
          
          {/* Users Tab - Only render when active */}
          <TabsContent value="users">
            {loadedTabs.includes('users') && (
              <UsersPanel 
                users={users}
                profile={profile}
                onRoleChange={handleRoleChange}
              />
            )}
          </TabsContent>
          
          {/* Roles Tab - Only render when active */}
          <TabsContent value="roles">
            {loadedTabs.includes('roles') && (
              <Card className="bg-puzzle-black border-puzzle-aqua/30">
                <CardHeader>
                  <CardTitle className="text-puzzle-white">Role Permissions</CardTitle>
                  <CardDescription>View permissions for each role</CardDescription>
                </CardHeader>
                <CardContent>
                  <RolePermissionsTable />
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
