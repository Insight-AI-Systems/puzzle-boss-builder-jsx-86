
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseMutationResult } from '@tanstack/react-query';
import { MemberDetailedProfile } from '@/types/memberTypes';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, User, Calendar, FileText, CheckCircle, Gamepad2, AlertCircle } from "lucide-react";
import { CreditBalanceCard } from '../CreditBalanceCard';
import { UserWallet } from '@/hooks/useMemberProfile';

export interface ProfileInfoTabProps {
  profile: MemberDetailedProfile & { wallet?: UserWallet };
  updateProfile: UseMutationResult<any, Error, Partial<MemberDetailedProfile>, unknown>;
  acceptTerms: UseMutationResult<any, Error, void, unknown>;
  awardCredits?: UseMutationResult<boolean, Error, { targetUserId: string; credits: number; adminNote?: string }, unknown>;
}

const profileFormSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be 20 characters or less")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens")
    .optional()
    .or(z.literal("")),
  bio: z.string().optional(),
  date_of_birth: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileInfoTab({ profile, updateProfile, acceptTerms, awardCredits }: ProfileInfoTabProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: profile.full_name || "",
      username: profile.username || "",
      bio: profile.bio || "",
      date_of_birth: profile.date_of_birth || "",
    },
  });

  function onSubmit(values: ProfileFormValues) {
    console.log('Form submitted with values:', values);
    updateProfile.mutate(values);
  }

  const handleAcceptTerms = () => {
    acceptTerms.mutate();
  };

  // Show any errors that occurred
  const hasError = updateProfile.error || acceptTerms.error;

  return (
    <div className="space-y-6">
      {/* Show error alert if there are any errors */}
      {hasError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {updateProfile.error?.message || acceptTerms.error?.message || 'An error occurred'}
          </AlertDescription>
        </Alert>
      )}

      {/* Credit & Balance Card - Only show if admin tools available */}
      {awardCredits && (
        <CreditBalanceCard 
          profile={profile} 
          awardCredits={awardCredits}
        />
      )}

      {/* Personal Information Card */}
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
                      <FormLabel className="text-puzzle-white">Full Name *</FormLabel>
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
                      <FormLabel className="text-puzzle-white flex items-center gap-2">
                        <Gamepad2 className="h-4 w-4" />
                        Username (Screen Name)
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Choose a username for leaderboards" 
                          className="bg-puzzle-black border-puzzle-aqua/30 text-puzzle-white"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-puzzle-white/60">
                        This is how your name will appear on game leaderboards. Leave empty to use your full name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-puzzle-white flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Biography
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little about yourself..."
                        className="resize-none bg-puzzle-black border-puzzle-aqua/30 text-puzzle-white"
                        rows={4}
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
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Terms & Conditions Card */}
      <Card className="bg-puzzle-black/50 border-puzzle-aqua/30">
        <CardHeader>
          <CardTitle className="text-puzzle-white">Terms & Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profile.terms_accepted ? (
              <Alert className="border-green-500/50 bg-green-500/10">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-400">
                  You accepted our terms and conditions on {new Date(profile.terms_accepted_at || '').toLocaleDateString()}.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                <p className="text-puzzle-white/70">Please review and accept our terms and conditions to continue.</p>
                <Button 
                  onClick={handleAcceptTerms} 
                  disabled={acceptTerms.isPending}
                  className="bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/90"
                >
                  {acceptTerms.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Accept Terms & Conditions"
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
