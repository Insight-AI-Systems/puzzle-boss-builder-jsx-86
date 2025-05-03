
import React, { useState } from 'react';
import { MemberDetailedProfile } from '@/types/memberTypes';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Save, AlertCircle, MailCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from 'date-fns';

interface ProfileInfoTabProps {
  profile: MemberDetailedProfile;
  updateProfile: any;
  acceptTerms: any;
}

export function ProfileInfoTab({ profile, updateProfile, acceptTerms }: ProfileInfoTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<MemberDetailedProfile>>({
    display_name: profile.display_name || '',
    bio: profile.bio || '',
    full_name: profile.full_name || '',
    phone: profile.phone || '',
    date_of_birth: profile.date_of_birth || '',
    tax_id: profile.tax_id || '',
    marketing_opt_in: profile.marketing_opt_in || false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // Reset form data when entering edit mode
      setFormData({
        display_name: profile.display_name || '',
        bio: profile.bio || '',
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        date_of_birth: profile.date_of_birth || '',
        tax_id: profile.tax_id || '',
        marketing_opt_in: profile.marketing_opt_in || false
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(formData, {
      onSuccess: () => {
        setIsEditing(false);
      }
    });
  };

  const handleAcceptTerms = () => {
    acceptTerms.mutate();
  };

  if (!isEditing) {
    return (
      <div className="space-y-4">
        {!profile.terms_accepted && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Terms Acceptance Required</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>Please accept our terms and conditions to fully activate your account.</span>
              <Button 
                onClick={handleAcceptTerms} 
                variant="default"
                size="sm"
                disabled={acceptTerms.isPending}
                className="bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/90"
              >
                {acceptTerms.isPending ? (
                  <>Loading...</>
                ) : (
                  <>
                    <MailCheck className="mr-2 h-4 w-4" />
                    Accept Terms
                  </>
                )}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div>
          <h3 className="text-sm font-medium text-puzzle-white mb-1">Email</h3>
          <p className="text-puzzle-white/80">{profile.email || 'No email added'}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-puzzle-white mb-1">Display Name</h3>
          <p className="text-puzzle-white/80">{profile.display_name || 'No display name added'}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-puzzle-white mb-1">Full Name</h3>
          <p className="text-puzzle-white/80">{profile.full_name || 'No full name added'}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-puzzle-white mb-1">Phone</h3>
          <p className="text-puzzle-white/80">{profile.phone || 'No phone number added'}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-puzzle-white mb-1">Date of Birth</h3>
          <p className="text-puzzle-white/80">
            {profile.date_of_birth ? format(new Date(profile.date_of_birth), 'MMMM dd, yyyy') : 'Not provided'}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-puzzle-white mb-1">Tax ID</h3>
          <p className="text-puzzle-white/80">{profile.tax_id || 'No tax ID added'}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-puzzle-white mb-1">Bio</h3>
          <p className="text-puzzle-white/80">{profile.bio || 'No bio information added yet.'}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-puzzle-white mb-1">Marketing Preferences</h3>
          <p className="text-puzzle-white/80">
            {profile.marketing_opt_in ? 'Subscribed to marketing emails' : 'Not subscribed to marketing emails'}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-puzzle-white mb-1">Terms Acceptance</h3>
          <p className="text-puzzle-white/80">
            {profile.terms_accepted 
              ? `Accepted on ${profile.terms_accepted_at ? format(new Date(profile.terms_accepted_at), 'MMMM dd, yyyy') : 'Unknown date'}` 
              : 'Terms not yet accepted'}
          </p>
        </div>

        <Button 
          onClick={handleEditToggle}
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="display_name" className="text-puzzle-white">Display Name</Label>
        <Input
          id="display_name"
          name="display_name"
          value={formData.display_name || ''}
          onChange={handleChange}
          className="bg-puzzle-black/50 border-puzzle-aqua/30 text-puzzle-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="full_name" className="text-puzzle-white">Full Name</Label>
        <Input
          id="full_name"
          name="full_name"
          value={formData.full_name || ''}
          onChange={handleChange}
          className="bg-puzzle-black/50 border-puzzle-aqua/30 text-puzzle-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-puzzle-white">Phone</Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone || ''}
          onChange={handleChange}
          className="bg-puzzle-black/50 border-puzzle-aqua/30 text-puzzle-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date_of_birth" className="text-puzzle-white">Date of Birth</Label>
        <Input
          id="date_of_birth"
          name="date_of_birth"
          type="date"
          value={formData.date_of_birth || ''}
          onChange={handleChange}
          className="bg-puzzle-black/50 border-puzzle-aqua/30 text-puzzle-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tax_id" className="text-puzzle-white">Tax ID</Label>
        <Input
          id="tax_id"
          name="tax_id"
          value={formData.tax_id || ''}
          onChange={handleChange}
          className="bg-puzzle-black/50 border-puzzle-aqua/30 text-puzzle-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="text-puzzle-white">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio || ''}
          onChange={handleChange}
          placeholder="Tell us about yourself..."
          className="bg-puzzle-black/50 border-puzzle-aqua/30 text-puzzle-white min-h-[100px]"
        />
      </div>

      <div className="space-y-2 flex items-center">
        <Checkbox
          id="marketing_opt_in"
          checked={formData.marketing_opt_in || false}
          onCheckedChange={(checked) => handleCheckboxChange('marketing_opt_in', checked as boolean)}
          className="mr-2 border-puzzle-aqua/30"
        />
        <Label htmlFor="marketing_opt_in" className="text-puzzle-white cursor-pointer">
          I would like to receive marketing communications
        </Label>
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
          onClick={handleEditToggle}
          className="border-puzzle-white/20 text-puzzle-white hover:bg-puzzle-white/10"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
