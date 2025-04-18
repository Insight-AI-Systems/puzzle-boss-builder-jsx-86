
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Pencil, Save } from 'lucide-react';
import { UserProfile } from '@/types/userTypes';

interface ProfileEditFormProps {
  isEditing: boolean;
  formData: Partial<UserProfile>;
  profile: UserProfile;
  updateProfile: any;
  onEditToggle: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ProfileEditForm({
  isEditing,
  formData,
  profile,
  updateProfile,
  onEditToggle,
  onChange,
  onSubmit
}: ProfileEditFormProps) {
  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-puzzle-white mb-1">About</h3>
          <p className="text-puzzle-white/80">
            {profile.bio || 'No bio information added yet.'}
          </p>
        </div>
        <Button 
          onClick={onEditToggle}
          variant="outline" 
          className="mt-4 border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua/10"
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="display_name" className="text-puzzle-white">Display Name</Label>
        <Input
          id="display_name"
          name="display_name"
          value={formData.display_name || ''}
          onChange={onChange}
          className="bg-puzzle-black/50 border-puzzle-aqua/30 text-puzzle-white"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="avatar_url" className="text-puzzle-white">Avatar URL</Label>
        <Input
          id="avatar_url"
          name="avatar_url"
          value={formData.avatar_url || ''}
          onChange={onChange}
          placeholder="https://example.com/avatar.jpg"
          className="bg-puzzle-black/50 border-puzzle-aqua/30 text-puzzle-white"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio" className="text-puzzle-white">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio || ''}
          onChange={onChange}
          placeholder="Tell us about yourself..."
          className="bg-puzzle-black/50 border-puzzle-aqua/30 text-puzzle-white min-h-[100px]"
        />
      </div>
      
      <div className="flex space-x-2 pt-2">
        <Button 
          type="submit" 
          className="bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/90"
          disabled={updateProfile.isPending}
        >
          {updateProfile.isPending ? 'Saving...' : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onEditToggle}
          className="border-puzzle-white/20 text-puzzle-white hover:bg-puzzle-white/10"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
