
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useForm } from "react-hook-form";
import { CalendarIcon, Save, Users } from "lucide-react";
import { format } from "date-fns";
import { useEmailTemplates } from "@/hooks/admin/useEmailTemplates";
import { useUserSegmentation } from "@/hooks/admin/useUserSegmentation";
import { EmailCampaign } from "./types";

interface CampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<EmailCampaign, 'id' | 'created_at' | 'sent' | 'opened'>) => void;
}

interface CampaignFormData {
  name: string;
  audience: string;
  template_id: string;
  schedule_date: Date | null;
  schedule_time: string;
}

export const CampaignDialog: React.FC<CampaignDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  const { templates, isLoading: templatesLoading } = useEmailTemplates();
  const { savedSegments, userCount, loadingUserCount } = useUserSegmentation();
  
  const form = useForm<CampaignFormData>({
    defaultValues: {
      name: '',
      audience: '',
      template_id: '',
      schedule_date: new Date(),
      schedule_time: '12:00',
    },
  });

  const handleSubmit = (data: CampaignFormData) => {
    const scheduledDate = data.schedule_date ? new Date(data.schedule_date) : null;
    if (scheduledDate && data.schedule_time) {
      const [hours, minutes] = data.schedule_time.split(':').map(Number);
      scheduledDate.setHours(hours, minutes);
    }

    onSubmit({
      name: data.name,
      audience: data.audience,
      status: scheduledDate ? 'scheduled' : 'draft',
      recipients: userCount,
      scheduled_for: scheduledDate?.toISOString(),
    });

    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Email Campaign</DialogTitle>
          <DialogDescription>
            Set up a new email campaign to send to your users.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter campaign name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="audience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Audience</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all_users">All Users</SelectItem>
                      <SelectItem value="active_users">Active Users</SelectItem>
                      {savedSegments.map(segment => (
                        <SelectItem key={segment.id} value={segment.id}>
                          {segment.name} ({segment.count} users)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {loadingUserCount ? "Calculating..." : `${userCount} recipients`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="template_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Template</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {templatesLoading ? (
                        <SelectItem value="loading" disabled>Loading templates...</SelectItem>
                      ) : templates && templates.length > 0 ? (
                        templates.map(template => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>No templates available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select an email template to use for this campaign.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="schedule_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Schedule Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className="w-full pl-3 text-left font-normal"
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="schedule_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
                Cancel
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
