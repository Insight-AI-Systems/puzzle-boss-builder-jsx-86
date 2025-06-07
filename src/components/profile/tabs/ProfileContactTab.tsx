
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
import { UseMutationResult } from '@tanstack/react-query';
import { MemberDetailedProfile } from '@/types/memberTypes';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Phone, Mail, FileText, Lock, CheckCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface ProfileContactTabProps {
  profile: MemberDetailedProfile;
  updateProfile: UseMutationResult<any, Error, Partial<MemberDetailedProfile>, unknown>;
  isAdmin: boolean;
}

const contactFormSchema = z.object({
  phone: z.string().optional(),
  tax_id: z.string().optional(),
  marketing_opt_in: z.boolean().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ProfileContactTab({ profile, updateProfile, isAdmin }: ProfileContactTabProps) {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      phone: profile.phone || "",
      tax_id: profile.tax_id || "",
      marketing_opt_in: profile.marketing_opt_in || false,
    },
  });

  function onSubmit(values: ContactFormValues) {
    updateProfile.mutate({
      ...values,
    });
  }

  return (
    <div className="space-y-6">
      {/* Contact Information Card */}
      <Card className="bg-puzzle-black/50 border-puzzle-gold/30">
        <CardHeader>
          <CardTitle className="text-puzzle-white flex items-center gap-2">
            <Phone className="h-5 w-5 text-puzzle-gold" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email - Read Only */}
                <div className="space-y-2">
                  <label className="text-puzzle-white flex items-center gap-2 text-sm font-medium">
                    <Mail className="h-4 w-4" />
                    Email Address
                    <Lock className="h-3 w-3 text-puzzle-white/50" />
                  </label>
                  <Input 
                    value={profile.email || 'Not set'}
                    disabled
                    className="bg-gray-800/50 border-gray-600 text-gray-400"
                  />
                  <p className="text-xs text-puzzle-white/50">
                    Email address cannot be changed. Contact support if needed.
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-puzzle-white">Phone Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your phone number" 
                          className="bg-puzzle-black border-puzzle-gold/30 text-puzzle-white"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="tax_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-puzzle-white flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Tax ID / VAT Number
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your tax ID (if applicable)" 
                        className="bg-puzzle-black border-puzzle-gold/30 text-puzzle-white"
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
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Save Contact Info
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Marketing Preferences Card */}
      <Card className="bg-puzzle-black/50 border-puzzle-gold/30">
        <CardHeader>
          <CardTitle className="text-puzzle-white">Marketing Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-puzzle-white font-medium">Marketing Communications</p>
                <p className="text-puzzle-white/60 text-sm">
                  Receive emails about new puzzles, special offers, and updates
                </p>
              </div>
              <Switch
                checked={form.watch('marketing_opt_in')}
                onCheckedChange={(checked) => {
                  form.setValue('marketing_opt_in', checked);
                  form.handleSubmit(onSubmit)();
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
