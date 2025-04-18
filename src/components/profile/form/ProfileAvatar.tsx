
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from 'lucide-react';
import { UserProfile } from '@/types/userTypes';

interface ProfileAvatarProps {
  profile: UserProfile;
}

export function ProfileAvatar({ profile }: ProfileAvatarProps) {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <Avatar className="h-20 w-20">
        <AvatarImage src={profile.avatar_url || ''} alt={profile.display_name || 'User'} />
        <AvatarFallback className="bg-puzzle-aqua/20 text-puzzle-aqua">
          <User className="h-10 w-10" />
        </AvatarFallback>
      </Avatar>
      <div>
        <h3 className="text-xl font-semibold text-puzzle-white">
          {profile.display_name || 'Anonymous Player'}
        </h3>
        <p className="text-sm text-puzzle-white/60">
          Member since {new Date(profile.created_at).toLocaleDateString()}
        </p>
        <div className="flex items-center mt-1">
          <p className="text-sm text-puzzle-gold mr-2">{profile.credits || 0} credits</p>
          {profile.referral_code && (
            <p className="text-xs text-puzzle-white/60">Referral: {profile.referral_code}</p>
          )}
        </div>
      </div>
    </div>
  );
}
