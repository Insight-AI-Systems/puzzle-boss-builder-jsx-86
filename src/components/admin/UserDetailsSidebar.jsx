
import React from 'react';
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
 * Minimal component to display user details sidebar
 * Drastically reduced to prevent excessive message size
 */
const UserDetailsSidebar = ({ selectedUser, profile, onRoleChange, onClose }) => {
  if (!selectedUser) {
    return (
      <Card className="bg-puzzle-black border-puzzle-aqua/30 h-full flex flex-col justify-center items-center py-8">
        <CardContent className="text-center">
          <User size={48} className="mx-auto text-puzzle-aqua/50 mb-4" />
          <p className="text-muted-foreground">
            Select a user to view details
          </p>
        </CardContent>
      </Card>
    );
  }

  // Truncate ID to reduce message size
  const truncatedId = selectedUser.id?.substring(0, 8) + '...';
  
  return (
    <Card className="bg-puzzle-black border-puzzle-aqua/30">
      <CardHeader>
        <div className="text-puzzle-white text-xl font-semibold">User Details</div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center space-y-2 mb-4">
          <div className="h-16 w-16 rounded-full bg-puzzle-aqua/20 flex items-center justify-center">
            <User size={32} className="text-puzzle-aqua" />
          </div>
          <h3 className="text-lg font-medium text-puzzle-white">
            {selectedUser.username || 'No username'}
          </h3>
        </div>
        
        <div className="space-y-3">
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
