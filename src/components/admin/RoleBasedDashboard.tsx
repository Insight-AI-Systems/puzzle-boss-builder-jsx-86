
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from './UserManagement';
import { RoleManagement } from './RoleManagement';
import { UserProfile } from '@/types/userTypes';
import { useUserProfile } from '@/hooks/useUserProfile';

export function RoleBasedDashboard() {
  const { profile } = useUserProfile();
  const [activeTab, setActiveTab] = useState("users");
  
  const isSuperAdmin = profile?.role === 'super_admin';
  
  return (
    <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="users">User Management</TabsTrigger>
        {isSuperAdmin && (
          <TabsTrigger value="roles">Role Settings</TabsTrigger>
        )}
      </TabsList>
      <TabsContent value="users" className="pt-6">
        <UserManagement />
      </TabsContent>
      {isSuperAdmin && (
        <TabsContent value="roles" className="pt-6">
          <RoleManagement />
        </TabsContent>
      )}
    </Tabs>
  );
}
