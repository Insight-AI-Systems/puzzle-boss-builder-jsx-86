
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserProfile } from '@/types/userTypes';
import { ROLE_DEFINITIONS } from '@/types/userTypes';

interface ProfileHeaderProps {
  profile: UserProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const roleInfo = ROLE_DEFINITIONS[profile.role];

  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <CardTitle>User Profile</CardTitle>
        <CardDescription>Manage your profile information</CardDescription>
      </div>
      <Badge 
        className={
          profile.role === 'super-admin' ? 'bg-red-600' :
          profile.role === 'category_manager' ? 'bg-blue-600' :
          profile.role === 'social_media_manager' ? 'bg-green-600' :
          profile.role === 'partner_manager' ? 'bg-amber-600' :
          profile.role === 'cfo' ? 'bg-emerald-600' :
          'bg-slate-600'
        }
      >
        {roleInfo.label}
      </Badge>
    </CardHeader>
  );
}
