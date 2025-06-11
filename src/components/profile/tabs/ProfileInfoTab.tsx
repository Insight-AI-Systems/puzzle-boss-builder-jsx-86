import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Coins, CreditCard, User, Calendar, Award } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { MemberProfile } from '@/types/memberTypes';

interface ProfileInfoTabProps {
  profile: MemberProfile;
  updateProfile: any;
  acceptTerms: any;
  awardCredits?: (variables: { userId: string; amount: number; note: string }) => void;
}

export function ProfileInfoTab({ 
  profile, 
  updateProfile, 
  acceptTerms,
  awardCredits 
}: ProfileInfoTabProps) {
  const { toast } = useToast();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState<Record<string, any>>({});
  const [creditsAmount, setCreditsAmount] = useState('');
  const [creditsNote, setCreditsNote] = useState('');

  const handleSave = async (field: string) => {
    try {
      await updateProfile.mutateAsync({
        [field]: tempValues[field]
      });
      setEditingField(null);
      setTempValues({});
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValues({});
  };

  const handleEdit = (field: string, currentValue: any) => {
    setEditingField(field);
    setTempValues({ [field]: currentValue || '' });
  };

  const handleAwardCredits = () => {
    if (!awardCredits) return;
    
    const amount = parseInt(creditsAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid positive number",
        variant: "destructive",
      });
      return;
    }
    
    awardCredits({
      userId: profile.id,
      amount,
      note: creditsNote || 'Credits awarded by admin'
    });
    
    setCreditsAmount('');
    setCreditsNote('');
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isAdmin = awardCredits !== undefined;

  return (
    <div className="space-y-6">
      {/* Account Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{profile.credits || 0}</div>
            <p className="text-xs text-blue-600 mt-1">Real money credits for purchases</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tokens</CardTitle>
            <Coins className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{profile.tokens || 0}</div>
            <p className="text-xs text-yellow-600 mt-1">Promotional tokens for free play</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Credit Management */}
      {isAdmin && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950">
          <CardHeader>
            <CardTitle className="text-sm text-orange-800 dark:text-orange-200">
              Admin: Award Credits
            </CardTitle>
            <CardDescription className="text-orange-600 dark:text-orange-300">
              Award real money credits to this member
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="credits-amount">Amount</Label>
                <Input
                  id="credits-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={creditsAmount}
                  onChange={(e) => setCreditsAmount(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleAwardCredits}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  disabled={updateProfile.isPending}
                >
                  <Award className="h-4 w-4 mr-2" />
                  Award Credits
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="credits-note">Note (optional)</Label>
              <Textarea
                id="credits-note"
                placeholder="Reason for awarding credits..."
                value={creditsNote}
                onChange={(e) => setCreditsNote(e.target.value)}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Manage your personal details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            {editingField === 'username' ? (
              <div className="flex gap-2">
                <Input
                  id="username"
                  value={tempValues.username || ''}
                  onChange={(e) => setTempValues({ ...tempValues, username: e.target.value })}
                  placeholder="Enter username"
                />
                <Button onClick={() => handleSave('username')} size="sm">Save</Button>
                <Button onClick={handleCancel} size="sm" variant="outline">Cancel</Button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-sm">{profile.username || 'Not set'}</span>
                <Button
                  onClick={() => handleEdit('username', profile.username)}
                  size="sm"
                  variant="outline"
                >
                  Edit
                </Button>
              </div>
            )}
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="display_name">Display Name</Label>
            {editingField === 'display_name' ? (
              <div className="flex gap-2">
                <Input
                  id="display_name"
                  value={tempValues.display_name || ''}
                  onChange={(e) => setTempValues({ ...tempValues, display_name: e.target.value })}
                  placeholder="Enter display name"
                />
                <Button onClick={() => handleSave('display_name')} size="sm">Save</Button>
                <Button onClick={handleCancel} size="sm" variant="outline">Cancel</Button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-sm">{profile.display_name || 'Not set'}</span>
                <Button
                  onClick={() => handleEdit('display_name', profile.display_name)}
                  size="sm"
                  variant="outline"
                >
                  Edit
                </Button>
              </div>
            )}
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            {editingField === 'bio' ? (
              <div className="space-y-2">
                <Textarea
                  id="bio"
                  value={tempValues.bio || ''}
                  onChange={(e) => setTempValues({ ...tempValues, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button onClick={() => handleSave('bio')} size="sm">Save</Button>
                  <Button onClick={handleCancel} size="sm" variant="outline">Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm min-h-[3rem] p-2 bg-muted rounded">
                  {profile.bio || 'No bio provided'}
                </p>
                <Button
                  onClick={() => handleEdit('bio', profile.bio)}
                  size="sm"
                  variant="outline"
                >
                  Edit Bio
                </Button>
              </div>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            {editingField === 'gender' ? (
              <div className="flex gap-2">
                <Select
                  value={tempValues.gender || ''}
                  onValueChange={(value) => setTempValues({ ...tempValues, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => handleSave('gender')} size="sm">Save</Button>
                <Button onClick={handleCancel} size="sm" variant="outline">Cancel</Button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-sm">{profile.gender || 'Not specified'}</span>
                <Button
                  onClick={() => handleEdit('gender', profile.gender)}
                  size="sm"
                  variant="outline"
                >
                  Edit
                </Button>
              </div>
            )}
          </div>

          {/* Age Group */}
          <div className="space-y-2">
            <Label htmlFor="age_group">Age Group</Label>
            {editingField === 'age_group' ? (
              <div className="flex gap-2">
                <Select
                  value={tempValues.age_group || ''}
                  onValueChange={(value) => setTempValues({ ...tempValues, age_group: value })}
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
                <Button onClick={() => handleSave('age_group')} size="sm">Save</Button>
                <Button onClick={handleCancel} size="sm" variant="outline">Cancel</Button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-sm">{profile.age_group || 'Not specified'}</span>
                <Button
                  onClick={() => handleEdit('age_group', profile.age_group)}
                  size="sm"
                  variant="outline"
                >
                  Edit
                </Button>
              </div>
            )}
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            {editingField === 'country' ? (
              <div className="flex gap-2">
                <Input
                  id="country"
                  value={tempValues.country || ''}
                  onChange={(e) => setTempValues({ ...tempValues, country: e.target.value })}
                  placeholder="Enter country"
                />
                <Button onClick={() => handleSave('country')} size="sm">Save</Button>
                <Button onClick={handleCancel} size="sm" variant="outline">Cancel</Button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-sm">{profile.country || 'Not specified'}</span>
                <Button
                  onClick={() => handleEdit('country', profile.country)}
                  size="sm"
                  variant="outline"
                >
                  Edit
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Member Since</Label>
              <p className="text-sm">{formatDate(profile.created_at)}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Last Updated</Label>
              <p className="text-sm">{formatDate(profile.updated_at)}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Account Status</Label>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Active
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium">Terms Accepted</Label>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={profile.terms_accepted} 
                  onCheckedChange={(checked) => {
                    if (checked) {
                      acceptTerms.mutate();
                    }
                  }}
                />
                <Label htmlFor="terms" className="text-sm">
                  I accept the terms and conditions
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
