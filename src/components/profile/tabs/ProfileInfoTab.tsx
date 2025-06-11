
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { User, Save, Mail, Phone, MapPin, Calendar, Shield, Gift, Info, Check, X } from 'lucide-react';
import { MemberDetailedProfile } from '@/types/memberTypes';
import { toast } from "sonner";

interface ProfileInfoTabProps {
  profile: MemberDetailedProfile;
  updateProfile: any;
  acceptTerms: any;
  awardCredits?: (data: { targetUserId: string; credits: number; adminNote?: string }) => void;
}

export function ProfileInfoTab({ profile, updateProfile, acceptTerms, awardCredits }: ProfileInfoTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile.full_name || '',
    username: profile.username || '',
    bio: profile.bio || '',
    date_of_birth: profile.date_of_birth || '',
    gender: profile.gender || '',
    custom_gender: profile.custom_gender || '',
    age_group: profile.age_group || ''
  });
  const [creditsToAward, setCreditsToAward] = useState('');
  const [adminNote, setAdminNote] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('Submitting profile update with data:', formData);
      
      await updateProfile.mutateAsync(formData);
      
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleAcceptTerms = async () => {
    try {
      await acceptTerms.mutateAsync();
      toast.success('Terms accepted successfully!');
    } catch (error) {
      console.error('Failed to accept terms:', error);
      toast.error('Failed to accept terms. Please try again.');
    }
  };

  const handleAwardCredits = async () => {
    if (!awardCredits || !creditsToAward) return;
    
    try {
      await awardCredits({
        targetUserId: profile.id,
        credits: parseInt(creditsToAward),
        adminNote: adminNote || undefined
      });
      setCreditsToAward('');
      setAdminNote('');
      toast.success('Credits awarded successfully!');
    } catch (error) {
      console.error('Failed to award credits:', error);
      toast.error('Failed to award credits. Please try again.');
    }
  };

  const getDisplayName = () => {
    return profile.username || profile.display_name || profile.email || 'Anonymous User';
  };

  return (
    <div className="space-y-6">
      {/* Personal Information Card */}
      <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
        <CardHeader>
          <CardTitle className="text-puzzle-white flex items-center gap-2">
            <User className="h-5 w-5 text-puzzle-aqua" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-puzzle-white/70">Full Name</Label>
                  <p className="text-puzzle-white">{profile.full_name || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-puzzle-white/70">Username</Label>
                  <p className="text-puzzle-white">{profile.username || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-puzzle-white/70">Email</Label>
                  <p className="text-puzzle-white">{profile.email}</p>
                </div>
                <div>
                  <Label className="text-puzzle-white/70">Date of Birth</Label>
                  <p className="text-puzzle-white">
                    {profile.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : 'Not provided'}
                  </p>
                </div>
                {profile.gender && (
                  <div>
                    <Label className="text-puzzle-white/70">Gender</Label>
                    <p className="text-puzzle-white">
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
                    <Label className="text-puzzle-white/70">Age Range</Label>
                    <p className="text-puzzle-white">{profile.age_group}</p>
                  </div>
                )}
              </div>
              
              {profile.bio && (
                <div>
                  <Label className="text-puzzle-white/70">Bio</Label>
                  <p className="text-puzzle-white">{profile.bio}</p>
                </div>
              )}
              
              <Button 
                onClick={() => setIsEditing(true)}
                className="bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/90"
              >
                Edit Profile
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name" className="text-puzzle-white">Full Name</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="bg-puzzle-black/50 border-puzzle-aqua/30 text-puzzle-white"
                  />
                </div>
                <div>
                  <Label htmlFor="username" className="text-puzzle-white">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="bg-puzzle-black/50 border-puzzle-aqua/30 text-puzzle-white"
                  />
                </div>
                <div>
                  <Label htmlFor="date_of_birth" className="text-puzzle-white">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    className="bg-puzzle-black/50 border-puzzle-aqua/30 text-puzzle-white"
                  />
                </div>
                <div>
                  <Label htmlFor="gender" className="text-puzzle-white">Gender</Label>
                  <Select 
                    value={formData.gender}
                    onValueChange={(value) => handleSelectChange('gender', value)}
                  >
                    <SelectTrigger className="bg-puzzle-black/50 border-puzzle-aqua/30 text-puzzle-white">
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
                  
                  {formData.gender === 'custom' && (
                    <Input
                      name="custom_gender"
                      placeholder="Please specify"
                      value={formData.custom_gender}
                      onChange={handleInputChange}
                      className="bg-puzzle-black/50 border-puzzle-aqua/30 text-puzzle-white mt-2"
                    />
                  )}
                </div>
                <div>
                  <Label htmlFor="age_group" className="text-puzzle-white">Age Range</Label>
                  <Select 
                    value={formData.age_group}
                    onValueChange={(value) => handleSelectChange('age_group', value)}
                  >
                    <SelectTrigger className="bg-puzzle-black/50 border-puzzle-aqua/30 text-puzzle-white">
                      <SelectValue placeholder="Select age range" />
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
                </div>
              </div>
              
              <div>
                <Label htmlFor="bio" className="text-puzzle-white">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
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
                  onClick={() => setIsEditing(false)}
                  className="border-puzzle-white/20 text-puzzle-white hover:bg-puzzle-white/10"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
        <CardHeader>
          <CardTitle className="text-puzzle-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-puzzle-aqua" />
            Terms & Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {profile.terms_accepted ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <X className="h-5 w-5 text-red-500" />
              )}
              <div>
                <p className="text-puzzle-white">
                  {profile.terms_accepted ? 'Terms Accepted' : 'Terms Not Accepted'}
                </p>
                {profile.terms_accepted_at && (
                  <p className="text-sm text-puzzle-white/60">
                    Accepted on {new Date(profile.terms_accepted_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            
            {!profile.terms_accepted && (
              <Button 
                onClick={handleAcceptTerms}
                disabled={acceptTerms.isPending}
                className="bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/90"
              >
                {acceptTerms.isPending ? 'Processing...' : 'Accept Terms'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Admin Credit Management */}
      {awardCredits && (
        <Card className="bg-puzzle-black/50 border-yellow-500/30">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Admin: Award Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="credits" className="text-puzzle-white">Credits to Award</Label>
                  <Input
                    id="credits"
                    type="number"
                    value={creditsToAward}
                    onChange={(e) => setCreditsToAward(e.target.value)}
                    className="bg-puzzle-black/50 border-yellow-500/30 text-puzzle-white"
                    placeholder="Enter number of credits"
                  />
                </div>
                <div>
                  <Label htmlFor="admin-note" className="text-puzzle-white">Admin Note (Optional)</Label>
                  <Input
                    id="admin-note"
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    className="bg-puzzle-black/50 border-yellow-500/30 text-puzzle-white"
                    placeholder="Reason for awarding credits"
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleAwardCredits}
                disabled={!creditsToAward || isNaN(Number(creditsToAward))}
                className="bg-yellow-500 text-puzzle-black hover:bg-yellow-600"
              >
                <Gift className="h-4 w-4 mr-2" />
                Award {creditsToAward} Credits
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
