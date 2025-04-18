
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { UserRole, ROLE_DEFINITIONS } from '@/types/userTypes';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export function PermissionsExplorer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions'>('roles');

  // Fetch all permissions from the database
  const { data: permissions, isLoading: isLoadingPermissions } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  // Filter roles based on search term
  const filteredRoles = Object.values(ROLE_DEFINITIONS).filter(role => 
    role.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.permissions.some(perm => perm.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filter permissions based on search term
  const filteredPermissions = permissions?.filter(permission => 
    permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Permissions Explorer</CardTitle>
        <CardDescription>Explore roles and permissions in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-background/50"
            />
          </div>
        </div>

        <Tabs defaultValue="roles" onValueChange={(value) => setActiveTab(value as 'roles' | 'permissions')}>
          <TabsList className="mb-4">
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="roles">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Assignable By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoles.map((role) => (
                    <TableRow key={role.role}>
                      <TableCell>
                        <Badge 
                          className={
                            role.role === 'super_admin' ? 'bg-red-600' :
                            role.role === 'admin' ? 'bg-purple-600' :
                            role.role === 'category_manager' ? 'bg-blue-600' :
                            role.role === 'social_media_manager' ? 'bg-green-600' :
                            role.role === 'partner_manager' ? 'bg-amber-600' :
                            role.role === 'cfo' ? 'bg-emerald-600' :
                            'bg-slate-600'
                          }
                        >
                          {role.label}
                        </Badge>
                      </TableCell>
                      <TableCell>{role.description}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.map((perm) => (
                            <Badge key={perm} variant="outline" className="text-xs">
                              {perm}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {role.canBeAssignedBy.map((assignerRole) => (
                            <Badge key={assignerRole} variant="secondary" className="text-xs">
                              {ROLE_DEFINITIONS[assignerRole]?.label || assignerRole}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="permissions">
            {isLoadingPermissions ? (
              <div className="text-center py-4">Loading permissions...</div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Permission</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Roles with Permission</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPermissions?.map((permission) => (
                      <TableRow key={permission.id}>
                        <TableCell className="font-medium">{permission.name}</TableCell>
                        <TableCell>{permission.description}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(ROLE_DEFINITIONS)
                              .filter(([_, roleInfo]) => roleInfo.permissions.includes(permission.name))
                              .map(([role, roleInfo]) => (
                                <Badge 
                                  key={role} 
                                  className={
                                    role === 'super_admin' ? 'bg-red-600' :
                                    role === 'admin' ? 'bg-purple-600' :
                                    role === 'category_manager' ? 'bg-blue-600' :
                                    role === 'social_media_manager' ? 'bg-green-600' :
                                    role === 'partner_manager' ? 'bg-amber-600' :
                                    role === 'cfo' ? 'bg-emerald-600' :
                                    'bg-slate-600'
                                  }
                                >
                                  {roleInfo.label}
                                </Badge>
                              ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
