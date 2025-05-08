
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';
import { AgeGroup, Gender } from '@/types/userTypes';
import { Loader2 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { UserProfile } from '@/types/userTypes';

interface ProfileEditFormProps {
  userData?: UserProfile;
  onSave?: (data: Partial<UserProfile>) => void;
  onCancel?: () => void;
  readOnly?: boolean;
}

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
  { value: 'custom', label: 'Custom' }
];

const ageGroupOptions = [
  { value: '13-17', label: '13-17' },
  { value: '18-24', label: '18-24' },
  { value: '25-34', label: '25-34' },
  { value: '35-44', label: '35-44' },
  { value: '45-54', label: '45-54' },
  { value: '55-64', label: '55-64' },
  { value: '65_plus', label: '65+' }
];

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  userData,
  onSave,
  onCancel,
  readOnly = false
}) => {
  // Determine if we're using provided userData or fetching from the API
  const usingProvidedData = !!userData;
  
  const { profile, isLoading, updateProfile } = useUserProfile();
  const { toast } = useToast();
  
  // Use provided userData or fetched profile
  const data = userData || profile;
  
  // Form state
  const [displayName, setDisplayName] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [customGender, setCustomGender] = useState<string>('');
  const [ageGroup, setAgeGroup] = useState<AgeGroup | ''>('');
  const [formChanged, setFormChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Initialize form with profile data
  useEffect(() => {
    if (data) {
      setDisplayName(data.display_name || '');
      setBio(data.bio || '');
      setGender(data.gender || '');
      setCustomGender(data.custom_gender || '');
      setAgeGroup(data.age_group || '');
      setFormChanged(false);
    }
  }, [data]);
  
  // Track form changes
  useEffect(() => {
    if (data) {
      const hasChanged = 
        displayName !== (data.display_name || '') ||
        bio !== (data.bio || '') ||
        gender !== (data.gender || '') ||
        customGender !== (data.custom_gender || '') ||
        ageGroup !== (data.age_group || '');
      
      setFormChanged(hasChanged);
    }
  }, [displayName, bio, gender, customGender, ageGroup, data]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (readOnly) return;
    
    // Prepare data for update
    const updatedData: Partial<UserProfile> = {
      display_name: displayName,
      bio: bio,
      gender: gender as Gender,
      age_group: ageGroup as AgeGroup
    };
    
    // Only include custom_gender if gender is 'custom'
    if (gender === 'custom') {
      updatedData.custom_gender = customGender;
    }
    
    setIsSaving(true);
    
    try {
      if (onSave) {
        // Use provided callback
        onSave(updatedData);
      } else {
        // Use hook method
        await updateProfile.mutateAsync(updatedData);
        toast({
          title: 'Profile updated',
          description: 'Your profile has been successfully updated.'
        });
      }
      
      setFormChanged(false);
    } catch (error) {
      toast({
        title: 'Update failed',
        description: 'Failed to update your profile. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Loading state
  if (!data && isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // Event handlers for Select components
  const handleGenderChange = (value: string) => {
    setGender(value as Gender);
  };

  const handleAgeGroupChange = (value: string) => {
    setAgeGroup(value as AgeGroup);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {data?.avatar_url && (
        <div className="flex justify-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={data.avatar_url} alt={displayName || 'User'} />
            <AvatarFallback>{displayName?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
        </div>
      )}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={readOnly}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            disabled={readOnly}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={gender}
            onValueChange={handleGenderChange}
            disabled={readOnly}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your gender" />
            </SelectTrigger>
            <SelectContent>
              {genderOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {gender === 'custom' && (
          <div className="space-y-2">
            <Label htmlFor="customGender">Custom Gender</Label>
            <Input
              id="customGender"
              value={customGender}
              onChange={(e) => setCustomGender(e.target.value)}
              disabled={readOnly}
            />
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="ageGroup">Age Group</Label>
          <Select
            value={ageGroup}
            onValueChange={handleAgeGroupChange}
            disabled={readOnly}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your age group" />
            </SelectTrigger>
            <SelectContent>
              {ageGroupOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {!readOnly && (
        <div className="flex gap-4 justify-end pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={!formChanged || isSaving}
          >
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      )}
    </form>
  );
};

export default ProfileEditForm;
