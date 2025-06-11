
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UseMutationResult } from '@tanstack/react-query';
import { MemberDetailedProfile } from '@/types/memberTypes';
import { Loader2, User, Calendar, FileText, Save, Award, Shield } from "lucide-react";

interface ProfileInfoTabProps {
  profile: MemberDetailedProfile;
  updateProfile: UseMutationResult<any, Error, Partial<MemberDetailedProfile>, unknown>;
  acceptTerms: UseMutationResult<any, Error, void, unknown>;
  awardCredits?: UseMutationResult<any, Error, { targetUserId: string; credits: number; adminNote?: string }, unknown>;
}

const profileFormSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters').optional(),
  username: z.string().min(3, 'Username must be at least 3 characters').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  date_of_birth: z.string().optional(),
  gender: z.enum(['male', 'female', 'non-binary', 'custom', 'prefer-not-to-say', 'other']).optional(),
  custom_gender: z.string().optional(),
  age_group: z.enum(['13-17', '18-24', '25-34', '35-44', '45-60', '60+']).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileInfoTab({ profile, updateProfile, acceptTerms, awardCredits }: ProfileInfoTabProps) {
  const [showCustomGender, setShowCustomGender] = React.useState(profile.gender === 'custom');
  const [creditsToAward, setCreditsToAward] = React.useState(0);
  const [adminNote, setAdminNote] = React.useState('');

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: profile.full_name || "",
      username: profile.username || "",
      bio: profile.bio || "",
      date_of_birth: profile.date_of_birth || "",
      gender: profile.gender || undefined,
      custom_gender: profile.custom_gender || "",
      age_group: profile.age_group || undefined,
    },
  });

  const watchedGender = form.watch('gender');
  
  React.useEffect(() => {
    setShowCustomGender(watchedGender === 'custom');
    if (watchedGender !== 'custom') {
      form.setValue('custom_gender', '');
    }
  }, [watchedGender, form]);

  function onSubmit(values: ProfileFormValues) {
    updateProfile.mutate(values);
  }

  const handleAcceptTerms = () => {
    acceptTerms.mutate();
  };

  const handleAwardCredits = () => {
    if (awardCredits && creditsToAward > 0) {
      awardCredits.mutate({
        targetUserId: profile.id,
        credits: creditsToAward,
        adminNote: adminNote || undefined
      });
      setCreditsToAward(0);
      setAdminNote('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Information Card */}
      <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
        <CardHeader>
          <CardTitle className="text-puzzle-white flex items-center gap-2">
            <User className="h-5 w-5 text-puzzle-aqua" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-puzzle-white">Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your full name" 
                          className="bg-puzzle-black border-puzzle-aqua/30 text-puzzle-white"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-puzzle-white">Username</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your username" 
                          className="bg-puzzle-black border-puzzle-aqua/30 text-puzzle-white"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date_of_birth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-puzzle-white flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Date of Birth
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          className="bg-puzzle-black border-puzzle-aqua/30 text-puzzle-white"
                          {...field} 
                        />
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
                      <FormLabel className="text-puzzle-white">Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-puzzle-black border-puzzle-aqua/30 text-puzzle-white">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-puzzle-black border-puzzle-aqua/30">
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
                        <FormLabel className="text-puzzle-white">Custom Gender</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Please specify" 
                            className="bg-puzzle-black border-puzzle-aqua/30 text-puzzle-white"
                            {...field} 
                          />
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
                      <FormLabel className="text-puzzle-white">Age Group</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-puzzle-black border-puzzle-aqua/30 text-puzzle-white">
                            <SelectValue placeholder="Select age group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-puzzle-black border-puzzle-aqua/30">
                          <SelectItem value="13-17">13-17</SelectItem>
                          <SelectItem value="18-24">18-24</SelectItem>
                          <SelectItem value="25-34">25-34</SelectItem>
                          <SelectItem value="35-44">35-44</SelectItem>
                          <SelectItem value="45-60">45-60</SelectItem>
                          <SelectItem value="60+">60+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-puzzle-white flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Bio
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us about yourself..." 
                        className="bg-puzzle-black border-puzzle-aqua/30 text-puzzle-white min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={updateProfile.isPending}
                  className="bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/90"
                >
                  {updateProfile.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Profile
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Terms and Conditions Card */}
      {!profile.terms_accepted && (
        <Card className="bg-puzzle-black/50 border-yellow-500/30">
          <CardHeader>
            <CardTitle className="text-puzzle-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-yellow-500" />
              Terms and Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-puzzle-white/70">
                You need to accept our terms and conditions to fully access all features.
              </p>
              <Button 
                onClick={handleAcceptTerms}
                disabled={acceptTerms.isPending}
                className="bg-yellow-500 text-puzzle-black hover:bg-yellow-500/90"
              >
                {acceptTerms.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Accept Terms & Conditions'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Admin Credit Management */}
      {awardCredits && (
        <Card className="bg-puzzle-black/50 border-puzzle-gold/30">
          <CardHeader>
            <CardTitle className="text-puzzle-white flex items-center gap-2">
              <Award className="h-5 w-5 text-puzzle-gold" />
              Admin: Award Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-puzzle-white text-sm font-medium">Credits to Award</label>
                  <Input
                    type="number"
                    min="0"
                    value={creditsToAward}
                    onChange={(e) => setCreditsToAward(Number(e.target.value))}
                    className="bg-puzzle-black border-puzzle-gold/30 text-puzzle-white"
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <label className="text-puzzle-white text-sm font-medium">Current Credits</label>
                  <div className="text-puzzle-gold text-lg font-bold mt-2">
                    {profile.credits || 0}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-puzzle-white text-sm font-medium">Admin Note</label>
                <Input
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="bg-puzzle-black border-puzzle-gold/30 text-puzzle-white"
                  placeholder="Reason for credit award (optional)"
                />
              </div>
              <Button 
                onClick={handleAwardCredits}
                disabled={awardCredits.isPending || creditsToAward <= 0}
                className="bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/90"
              >
                {awardCredits.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Awarding...
                  </>
                ) : (
                  <>
                    <Award className="mr-2 h-4 w-4" />
                    Award Credits
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
