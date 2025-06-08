
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Save, Info } from 'lucide-react';
import { UserProfile, Gender, AgeGroup } from '@/types/userTypes';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  // Handle select change for gender and age group
  const handleSelectChange = (field: string, value: string) => {
    const simulatedEvent = {
      target: { name: field, value }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(simulatedEvent);
  };

  // Updated age group values to match database enum exactly
  const ageGroupValues: AgeGroup[] = [
    '13-17',
    '18-24',
    '25-34',
    '35-44',
    '45-60',
    '60+'
  ];

  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-puzzle-white mb-1">About</h3>
          <p className="text-puzzle-white/80">
            {profile.bio || 'No bio information added yet.'}
          </p>
        </div>

        <div className="space-y-2">
          {profile.gender && (
            <div>
              <h3 className="text-sm font-medium text-puzzle-white mb-1">
                Gender
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 ml-1 inline cursor-help text-puzzle-white/60" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      We ask about your age range, gender, and location to help offer you the best puzzles and user experience.
                    </TooltipContent>
                  </Tooltip>
              </TooltipProvider>
              </h3>
              <p className="text-puzzle-white/80">
                {profile.gender === 'custom' && profile.custom_gender
                  ? profile.custom_gender
                  : profile.gender === 'prefer-not-to-say'
                    ? 'Prefer not to say'
                    : profile.gender === 'non-binary'
                      ? 'Non-binary'
                      : profile.gender}
              </p>
            </div>
          )}

          {profile.age_group && (
            <div>
              <h3 className="text-sm font-medium text-puzzle-white mb-1">Age Range</h3>
              <p className="text-puzzle-white/80">{profile.age_group}</p>
            </div>
          )}
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
        <div className="flex items-center">
          <Label htmlFor="gender" className="text-puzzle-white">Gender</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 ml-1 cursor-help text-puzzle-white/60" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                We ask about your age range, gender, and location to help offer you the best puzzles and user experience.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select 
          value={formData.gender || undefined}
          onValueChange={(value) => handleSelectChange('gender', value)}
        >
          <SelectTrigger className="bg-puzzle-black/50 border-puzzle-aqua/30 text-puzzle-white w-full">
            <SelectValue placeholder="Select your gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="non-binary">Non-binary</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
          </SelectContent>
        </Select>
        
        {formData.gender === 'custom' && (
          <div className="mt-2">
            <Label htmlFor="custom_gender" className="text-puzzle-white">Please specify</Label>
            <Input
              id="custom_gender"
              name="custom_gender"
              value={formData.custom_gender || ''}
              onChange={onChange}
              className="bg-puzzle-black/50 border-puzzle-aqua/30 text-puzzle-white mt-1"
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="age_group" className="text-puzzle-white">Age Range</Label>
        <Select 
          value={formData.age_group || undefined}
          onValueChange={(value) => handleSelectChange('age_group', value)}
        >
          <SelectTrigger className="bg-puzzle-black/50 border-puzzle-aqua/30 text-puzzle-white w-full">
            <SelectValue placeholder="Select your age range" />
          </SelectTrigger>
          <SelectContent>
            {ageGroupValues.map((ageGroup) => (
              <SelectItem key={ageGroup} value={ageGroup}>
                {ageGroup}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
