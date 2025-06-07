
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
import { UseMutationResult } from '@tanstack/react-query';
import { MemberDetailedProfile } from '@/types/memberTypes';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { CreditBalanceCard } from '../CreditBalanceCard';
import { UserWallet } from '@/hooks/useMemberProfile';

export interface ProfileInfoTabProps {
  profile: MemberDetailedProfile & { wallet?: UserWallet };
  updateProfile: UseMutationResult<any, Error, Partial<MemberDetailedProfile>, unknown>;
  acceptTerms: UseMutationResult<any, Error, void, unknown>;
  awardCredits?: UseMutationResult<boolean, Error, { targetUserId: string; credits: number; adminNote?: string }, unknown>;
}

const profileFormSchema = z.object({
  full_name: z.string().optional(),
  bio: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  tax_id: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileInfoTab({ profile, updateProfile, acceptTerms, awardCredits }: ProfileInfoTabProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: profile.full_name || "",
      bio: profile.bio || "",
      email: profile.email || "",
      phone: profile.phone || "",
      tax_id: profile.tax_id || "",
    },
  });

  function onSubmit(values: ProfileFormValues) {
    updateProfile.mutate({
      ...values,
    });
  }

  const handleAcceptTerms = () => {
    acceptTerms.mutate();
  };

  return (
    <div className="space-y-6">
      {/* Credit & Balance Card */}
      {awardCredits && (
        <CreditBalanceCard 
          profile={profile} 
          awardCredits={awardCredits}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" disabled placeholder="Your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tax_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax ID / VAT Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your tax ID (if applicable)" {...field} />
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
                      <Textarea
                        placeholder="Tell us a little about yourself"
                        className="resize-none"
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
                  className="bg-puzzle-gold text-puzzle-black hover:bg-puzzle-gold/90"
                >
                  {updateProfile.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Terms & Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profile.terms_accepted ? (
              <Alert>
                <AlertDescription>
                  You have accepted our terms and conditions on {new Date(profile.terms_accepted_at || '').toLocaleDateString()}.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                <p className="text-sm">Please review and accept our terms and conditions to continue.</p>
                <Button 
                  onClick={handleAcceptTerms} 
                  disabled={acceptTerms.isPending}
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
