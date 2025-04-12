
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { User } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ROLES, PERMISSIONS, hasPermission } from '@/utils/permissions';

/**
 * Component to display user details sidebar in the admin dashboard
 * Optimized to reduce render size and improve performance
 */
const UserDetailsSidebar = ({ selectedUser, profile, onRoleChange, onClose }) => {
  if (!selectedUser) {
    return (
      <Card className="bg-puzzle-black border-puzzle-aqua/30 h-full flex flex-col justify-center items-center py-8">
        <CardContent className="text-center">
          <User size={48} className="mx-auto text-puzzle-aqua/50 mb-4" />
          <p className="text-muted-foreground">
            Select a user to view details and manage their role
          </p>
        </CardContent>
      </Card>
    );
  }

  // Only render required user data to reduce payload
  const userDetails = [
    { label: "User ID", value: selectedUser.id },
    { label: "Credits", value: selectedUser.credits || 0 },
    { label: "Joined", value: new Date(selectedUser.created_at).toLocaleDateString() },
    { label: "Last Updated", value: new Date(selectedUser.updated_at || selectedUser.created_at).toLocaleDateString() }
  ];

  return (
    <Card className="bg-puzzle-black border-puzzle-aqua/30">
      <CardHeader>
        <div className="text-puzzle-white text-xl font-semibold">User Details</div>
        <div className="text-sm text-muted-foreground">View and edit user information</div>
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
          {userDetails.map((detail, index) => (
            <div key={index}>
              <label className="text-muted-foreground text-sm mb-1 block">
                {detail.label}
              </label>
              <Input 
                value={detail.value} 
                disabled 
                className="bg-puzzle-black/50"
              />
            </div>
          ))}
          
          <div>
            <label className="text-muted-foreground text-sm mb-1 block">
              Role
            </label>
            <Select
              defaultValue={selectedUser.role}
              onValueChange={(value) => onRoleChange(selectedUser.id, value)}
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
          onClick={onClose}
          className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10"
        >
          Close
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserDetailsSidebar;
