
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MemberDetailedProfile } from '@/types/memberTypes';
import { UseMutationResult } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { User, Shield, Calendar, Award, Coins } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';

interface ProfileInfoTabProps {
  profile: MemberDetailedProfile;
  updateProfile: UseMutationResult<any, Error, Partial<MemberDetailedProfile>, unknown>;
  acceptTerms: UseMutationResult<any, Error, void, unknown>;
  awardCredits?: (variables: { targetUserId: string; credits: number; adminNote?: string }) => void;
}

export function ProfileInfoTab({ profile, updateProfile, acceptTerms, awardCredits }: ProfileInfoTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [adminCredits, setAdminCredits] = useState('');
  const [adminNote, setAdminNote] = useState('');
  
  // Get the current user's admin status from useUserProfile
  const { isAdmin } = useUserProfile();

  const { register, handleSubmit, formState: { isDirty }, setValue, watch } = useForm({
    defaultValues: {
      full_name: profile.full_name || '',
      username: profile.username || '',
      bio: profile.bio || '',
      date_of_birth: profile.date_of_birth || '',
      gender: profile.gender || '',
      custom_gender: profile.custom_gender || '',
      age_group: profile.age_group || ''
    }
  });

  const watchedGender = watch('gender');

  const onSubmit = (data: any) => {
    updateProfile.mutate(data, {
      onSuccess: () => {
        setIsEditing(false);
      }
    });
  };

  const handleAwardCredits = () => {
    if (!awardCredits || !isAdmin) return;
    
    const credits = parseInt(adminCredits);
    if (isNaN(credits) || credits <= 0) return;
    
    awardCredits({
      targetUserId: profile.id,
      credits: credits,
      adminNote: adminNote || undefined
    });
    
    setAdminCredits('');
    setAdminNote('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Basic Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <CardTitle>Personal Information</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              disabled={updateProfile.isPending}
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </div>
          <CardDescription>
            Manage your personal details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  {...register('full_name')}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-muted' : ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  {...register('username')}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-muted' : ''}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                {...register('bio')}
                disabled={!isEditing}
                className={!isEditing ? 'bg-muted' : ''}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  {...register('date_of_birth')}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-muted' : ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age_group">Age Group</Label>
                {isEditing ? (
                  <Select 
                    value={watch('age_group')} 
                    onValueChange={(value) => setValue('age_group', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select age group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="13-17">13-17</SelectItem>
                      <SelectItem value="18-24">18-24</SelectItem>
                      <SelectItem value="25-34">25-34</SelectItem>
                      <SelectItem value="35-44">35-44</SelectItem>
                      <SelectItem value="45-60">45-60</SelectItem>
                      <SelectItem value="60+">60+</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={profile.age_group || 'Not specified'}
                    disabled
                    className="bg-muted"
                  />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              {isEditing ? (
                <Select 
                  value={watchedGender} 
                  onValueChange={(value) => setValue('gender', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={profile.gender === 'custom' && profile.custom_gender 
                    ? profile.custom_gender 
                    : profile.gender || 'Not specified'}
                  disabled
                  className="bg-muted"
                />
              )}
            </div>

            {isEditing && watchedGender === 'custom' && (
              <div className="space-y-2">
                <Label htmlFor="custom_gender">Custom Gender</Label>
                <Input
                  id="custom_gender"
                  {...register('custom_gender')}
                  placeholder="Please specify"
                />
              </div>
            )}

            {isEditing && (
              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  disabled={!isDirty || updateProfile.isPending}
                  className="flex-1"
                >
                  {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Account Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Role</span>
              <Badge variant="outline">{profile.role}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Credits</span>
              <Badge variant="secondary">{profile.credits}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Tokens</span>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                {profile.tokens || 0} tokens
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Terms Accepted</span>
              <Badge variant={profile.terms_accepted ? "default" : "destructive"}>
                {profile.terms_accepted ? "Yes" : "No"}
              </Badge>
            </div>
            {!profile.terms_accepted && (
              <Button
                onClick={() => acceptTerms.mutate()}
                disabled={acceptTerms.isPending}
                className="w-full mt-2"
              >
                {acceptTerms.isPending ? 'Accepting...' : 'Accept Terms'}
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Membership Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Member Since</span>
              <span className="text-sm">{formatDate(profile.created_at)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Last Updated</span>
              <span className="text-sm">{formatDate(profile.updated_at)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Marketing Opt-in</span>
              <Badge variant={profile.marketing_opt_in ? "default" : "secondary"}>
                {profile.marketing_opt_in ? "Yes" : "No"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tools (only visible to admins) */}
      {isAdmin && awardCredits && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Admin Tools
            </CardTitle>
            <CardDescription>
              Administrative actions for this member
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="admin-credits">Award Credits</Label>
              <Input
                id="admin-credits"
                type="number"
                placeholder="Number of credits to award"
                value={adminCredits}
                onChange={(e) => setAdminCredits(e.target.value)}
              />
              <Label htmlFor="admin-note">Admin Note</Label>
              <Textarea
                id="admin-note"
                placeholder="Reason for awarding credits..."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
              />
              <Button
                onClick={handleAwardCredits}
                disabled={!adminCredits || isNaN(parseInt(adminCredits))}
                className="w-full"
              >
                <Coins className="h-4 w-4 mr-2" />
                Award Credits
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
