
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UserProfile, UserRole, ROLE_DEFINITIONS } from '@/types/userTypes';
import { Loader2 } from 'lucide-react';

const profileEditSchema = z.object({
  display_name: z.string().min(2, 'Display name must be at least 2 characters').max(50, 'Display name must be less than 50 characters'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  country: z.string().max(100, 'Country must be less than 100 characters').optional(),
  gender: z.enum(['male', 'female', 'non-binary', 'custom', 'prefer-not-to-say', 'other']).optional(),
  custom_gender: z.string().max(50, 'Custom gender must be less than 50 characters').optional(),
  age_group: z.enum(['under_18', '18_24', '25_34', '35_44', '45_54', '55_64', '65_plus']).optional(),
  role: z.enum(['super_admin', 'admin', 'category_manager', 'social_media_manager', 'partner_manager', 'cfo', 'player'])
}).refine(
  (data) => {
    if (data.gender === 'custom') {
      return data.custom_gender && data.custom_gender.length > 0;
    }
    return true;
  },
  {
    message: "Custom gender must be specified when gender is 'custom'",
    path: ["custom_gender"]
  }
);

type ProfileEditFormData = z.infer<typeof profileEditSchema>;

interface ProfileEditFormProps {
  user: UserProfile;
  currentUserRole: UserRole;
  onSave: (userId: string, updates: Partial<UserProfile>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function ProfileEditForm({ user, currentUserRole, onSave, onCancel, isLoading }: ProfileEditFormProps) {
  const [showCustomGender, setShowCustomGender] = useState(user.gender === 'custom');

  const form = useForm<ProfileEditFormData>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      display_name: user.display_name || '',
      bio: user.bio || '',
      country: user.country || '',
      gender: user.gender || undefined,
      custom_gender: user.custom_gender || '',
      age_group: user.age_group || undefined,
      role: user.role
    }
  });

  const watchedGender = form.watch('gender');
  
  React.useEffect(() => {
    setShowCustomGender(watchedGender === 'custom');
    if (watchedGender !== 'custom') {
      form.setValue('custom_gender', '');
    }
  }, [watchedGender, form]);

  const onSubmit = async (data: ProfileEditFormData) => {
    try {
      await onSave(user.id, data);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  // Check if current user can edit roles
  const canEditRole = currentUserRole === 'super_admin' || 
    (currentUserRole === 'admin' && user.role !== 'super_admin');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="display_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter display name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Tell us about this user..." rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter country" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {showCustomGender && (
          <FormField
            control={form.control}
            name="custom_gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Gender</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Please specify" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="age_group"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age Group</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select age group" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="under_18">Under 18</SelectItem>
                  <SelectItem value="18_24">18-24</SelectItem>
                  <SelectItem value="25_34">25-34</SelectItem>
                  <SelectItem value="35_44">35-44</SelectItem>
                  <SelectItem value="45_54">45-54</SelectItem>
                  <SelectItem value="55_64">55-64</SelectItem>
                  <SelectItem value="65_plus">65+</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {canEditRole && (
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(ROLE_DEFINITIONS).map(([roleKey, roleDef]) => {
                      // Only show roles that the current user can assign
                      if (currentUserRole === 'super_admin' || roleKey !== 'super_admin') {
                        return (
                          <SelectItem key={roleKey} value={roleKey}>
                            {roleDef.label}
                          </SelectItem>
                        );
                      }
                      return null;
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex gap-2 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
