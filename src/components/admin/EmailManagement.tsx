
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Mail, Search, Plus, Edit, Trash2, Filter, 
  CheckCircle, Mail as MailIcon, MailCheck, MailWarning, 
  Settings, Send, Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";

type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  type: 'verification' | 'notification' | 'marketing' | 'system';
  status: 'active' | 'draft' | 'archived';
  created_at: string;
  last_sent?: string;
};

type EmailCampaign = {
  id: string;
  name: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'draft';
  audience: string;
  recipients: number;
  sent: number;
  opened: number;
  scheduled_for?: string;
  created_at: string;
};

export const EmailManagement: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('templates');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isCampaignDialogOpen, setIsCampaignDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  
  const [currentTemplate, setCurrentTemplate] = useState<EmailTemplate | null>(null);
  const [currentCampaign, setCurrentCampaign] = useState<EmailCampaign | null>(null);

  // Mock email templates
  const emailTemplates: EmailTemplate[] = [
    {
      id: '1',
      name: 'Welcome Email',
      subject: 'Welcome to Puzzle Boss!',
      type: 'verification',
      status: 'active',
      created_at: '2025-03-15T10:30:00Z',
      last_sent: '2025-04-16T08:45:12Z'
    },
    {
      id: '2',
      name: 'Prize Winner Notification',
      subject: 'Congratulations! You won a prize!',
      type: 'notification',
      status: 'active',
      created_at: '2025-03-10T14:22:30Z',
      last_sent: '2025-04-15T17:33:45Z'
    },
    {
      id: '3',
      name: 'New Puzzle Announcement',
      subject: 'New Puzzle Available: iPhone 15 Challenge',
      type: 'marketing',
      status: 'draft',
      created_at: '2025-04-14T09:15:00Z'
    },
    {
      id: '4',
      name: 'Account Verification',
      subject: 'Verify Your Puzzle Boss Account',
      type: 'verification',
      status: 'active',
      created_at: '2025-02-20T11:20:15Z',
      last_sent: '2025-04-16T09:12:33Z'
    },
    {
      id: '5',
      name: 'Weekly Newsletter',
      subject: 'This Week at Puzzle Boss: New Prizes & Winners',
      type: 'marketing',
      status: 'active',
      created_at: '2025-03-05T16:45:22Z',
      last_sent: '2025-04-12T10:00:00Z'
    }
  ];

  // Mock email campaigns
  const emailCampaigns: EmailCampaign[] = [
    {
      id: '1',
      name: 'April Newsletter',
      status: 'completed',
      audience: 'All Active Users',
      recipients: 12568,
      sent: 12568,
      opened: 7841,
      created_at: '2025-04-01T08:30:00Z'
    },
    {
      id: '2',
      name: 'New Smartphone Puzzles',
      status: 'in_progress',
      audience: 'Smartphone Category Fans',
      recipients: 5432,
      sent: 4255,
      opened: 2810,
      created_at: '2025-04-15T14:00:00Z'
    },
    {
      id: '3',
      name: 'Special Weekend Promotion',
      status: 'scheduled',
      audience: 'All Users',
      recipients: 15000,
      sent: 0,
      opened: 0,
      scheduled_for: '2025-04-19T09:00:00Z',
      created_at: '2025-04-16T11:30:00Z'
    },
    {
      id: '4',
      name: 'Re-engagement Campaign',
      status: 'draft',
      audience: 'Inactive Users (30+ days)',
      recipients: 4782,
      sent: 0,
      opened: 0,
      created_at: '2025-04-14T15:45:00Z'
    },
    {
      id: '5',
      name: 'Holiday Special Announcement',
      status: 'draft',
      audience: 'All Verified Users',
      recipients: 13450,
      sent: 0,
      opened: 0,
      created_at: '2025-04-10T12:15:00Z'
    }
  ];

  // Filter templates based on search and filters
  const filteredTemplates = emailTemplates.filter(template => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || template.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || template.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Filter campaigns based on search
  const filteredCampaigns = emailCampaigns.filter(campaign => {
    return campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           campaign.audience.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const templateForm = useForm({
    defaultValues: {
      name: '',
      subject: '',
      type: 'notification' as const,
      content: ''
    }
  });

  const campaignForm = useForm({
    defaultValues: {
      name: '',
      audience: '',
      template_id: '',
      scheduled_for: ''
    }
  });

  const handleCreateTemplate = templateForm.handleSubmit((data) => {
    toast({
      title: "Template created",
      description: "Your email template has been created successfully.",
    });
    setIsTemplateDialogOpen(false);
  });

  const handleCreateCampaign = campaignForm.handleSubmit((data) => {
    toast({
      title: "Campaign created",
      description: "Your email campaign has been created successfully.",
    });
    setIsCampaignDialogOpen(false);
  });

  const handlePreviewTemplate = (template: EmailTemplate) => {
    setCurrentTemplate(template);
    setIsPreviewDialogOpen(true);
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      toast({
        title: "Template deleted",
        description: "Your email template has been deleted successfully.",
      });
    }
  };

  const handleSendTestEmail = () => {
    toast({
      title: "Test email sent",
      description: "A test email has been sent to your address.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Mail className="h-5 w-5 mr-2" />
          Email Management
        </CardTitle>
        <CardDescription>Manage email templates, campaigns, and notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="templates" 
          className="space-y-6"
          onValueChange={value => setActiveTab(value)}
        >
          <TabsList>
            <TabsTrigger value="templates">
              <Mail className="h-4 w-4 mr-2" />
              Email Templates
            </TabsTrigger>
            <TabsTrigger value="campaigns">
              <MailCheck className="h-4 w-4 mr-2" />
              Email Campaigns
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Email Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center w-full sm:w-auto gap-2">
                  <div className="relative flex-grow w-full sm:w-auto">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search templates..."
                      className="pl-8 w-full sm:w-[300px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="verification">Verification</SelectItem>
                      <SelectItem value="notification">Notification</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 whitespace-nowrap">
                      <Plus className="h-4 w-4 mr-2" />
                      New Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Create Email Template</DialogTitle>
                      <DialogDescription>
                        Create a new email template for your communications.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...templateForm}>
                      <form onSubmit={handleCreateTemplate} className="space-y-6">
                        <FormField
                          control={templateForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Template Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter template name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={templateForm.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Subject</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter email subject" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={templateForm.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Template Type</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select template type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="verification">Verification</SelectItem>
                                  <SelectItem value="notification">Notification</SelectItem>
                                  <SelectItem value="marketing">Marketing</SelectItem>
                                  <SelectItem value="system">System</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                The type determines how and when this template will be used.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={templateForm.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Content</FormLabel>
                              <FormControl>
                                <textarea 
                                  className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  placeholder="Enter email content"
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                You can use HTML formatting and variables like {'{name}'} in your content.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <Button onClick={handleSendTestEmail} type="button" variant="outline" className="mr-auto">
                            <Send className="h-4 w-4 mr-2" />
                            Send Test
                          </Button>
                          <Button type="submit" className="bg-puzzle-aqua hover:bg-puzzle-aqua/80">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Create Template
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Template Name</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Sent</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTemplates.length > 0 ? (
                      filteredTemplates.map((template) => (
                        <TableRow key={template.id}>
                          <TableCell className="font-medium">{template.name}</TableCell>
                          <TableCell>{template.subject}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              template.type === 'verification' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                              template.type === 'notification' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                              template.type === 'marketing' ? 'bg-green-100 text-green-800 border-green-200' :
                              'bg-gray-100 text-gray-800 border-gray-200'
                            }>
                              {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              template.status === 'active' ? 'bg-green-600' :
                              template.status === 'draft' ? 'bg-gray-600' :
                              'bg-red-600'
                            }>
                              {template.status.charAt(0).toUpperCase() + template.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {template.last_sent ? new Date(template.last_sent).toLocaleDateString() : 'Never sent'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => handlePreviewTemplate(template)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="text-red-500"
                                onClick={() => handleDeleteTemplate(template.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No templates found. Try adjusting your filters or create a new template.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="campaigns">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="relative w-full sm:w-[300px]">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search campaigns..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Dialog open={isCampaignDialogOpen} onOpenChange={setIsCampaignDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-puzzle-aqua hover:bg-puzzle-aqua/80">
                      <Plus className="h-4 w-4 mr-2" />
                      New Campaign
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Create Email Campaign</DialogTitle>
                      <DialogDescription>
                        Set up a new email campaign for your audience.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...campaignForm}>
                      <form onSubmit={handleCreateCampaign} className="space-y-6">
                        <FormField
                          control={campaignForm.control}
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
                          control={campaignForm.control}
                          name="audience"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Target Audience</FormLabel>
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
                                  <SelectItem value="inactive_users">Inactive Users (30+ days)</SelectItem>
                                  <SelectItem value="new_users">New Users (Last 7 days)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Select who should receive this campaign.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={campaignForm.control}
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
                                  {emailTemplates.map(template => (
                                    <SelectItem key={template.id} value={template.id}>
                                      {template.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={campaignForm.control}
                          name="scheduled_for"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Schedule Date/Time</FormLabel>
                              <FormControl>
                                <Input type="datetime-local" {...field} />
                              </FormControl>
                              <FormDescription>
                                When this campaign should be sent. Leave blank to save as draft.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <Button type="submit" className="bg-puzzle-aqua hover:bg-puzzle-aqua/80">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Create Campaign
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Audience</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Open Rate</TableHead>
                      <TableHead>Scheduled For</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCampaigns.length > 0 ? (
                      filteredCampaigns.map((campaign) => (
                        <TableRow key={campaign.id}>
                          <TableCell className="font-medium">{campaign.name}</TableCell>
                          <TableCell>
                            <Badge className={
                              campaign.status === 'completed' ? 'bg-green-600' :
                              campaign.status === 'in_progress' ? 'bg-blue-600' :
                              campaign.status === 'scheduled' ? 'bg-amber-600' :
                              'bg-gray-600'
                            }>
                              {campaign.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>{campaign.audience}</TableCell>
                          <TableCell>{campaign.recipients.toLocaleString()}</TableCell>
                          <TableCell>
                            {campaign.sent > 0 ? `${Math.round((campaign.opened / campaign.sent) * 100)}%` : '-'}
                          </TableCell>
                          <TableCell>
                            {campaign.scheduled_for ? new Date(campaign.scheduled_for).toLocaleString() : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon" className="text-red-500">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No campaigns found. Try adjusting your search or create a new campaign.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Email Provider Settings</CardTitle>
                  <CardDescription>Configure your email delivery service settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email Service Provider</Label>
                      <Select defaultValue="custom_smtp">
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="custom_smtp">Custom SMTP</SelectItem>
                          <SelectItem value="sendgrid">SendGrid</SelectItem>
                          <SelectItem value="mailgun">Mailgun</SelectItem>
                          <SelectItem value="aws_ses">AWS SES</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>From Email Address</Label>
                      <Input placeholder="noreply@puzzleboss.com" defaultValue="noreply@puzzleboss.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>From Name</Label>
                      <Input placeholder="Puzzle Boss" defaultValue="Puzzle Boss" />
                    </div>
                    <div className="space-y-2">
                      <Label>Reply-To Email</Label>
                      <Input placeholder="support@puzzleboss.com" defaultValue="support@puzzleboss.com" />
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button className="bg-puzzle-aqua hover:bg-puzzle-aqua/80">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Save Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Configure when system emails are sent</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox id="welcome" defaultChecked />
                      <div className="space-y-1 leading-none">
                        <Label htmlFor="welcome">Welcome Email</Label>
                        <p className="text-sm text-muted-foreground">
                          Send a welcome email when a new user signs up
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox id="verification" defaultChecked />
                      <div className="space-y-1 leading-none">
                        <Label htmlFor="verification">Email Verification</Label>
                        <p className="text-sm text-muted-foreground">
                          Require email verification for new accounts
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox id="prize_win" defaultChecked />
                      <div className="space-y-1 leading-none">
                        <Label htmlFor="prize_win">Prize Win Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Send email notifications when a user wins a prize
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox id="new_puzzle" defaultChecked />
                      <div className="space-y-1 leading-none">
                        <Label htmlFor="new_puzzle">New Puzzle Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Notify users when new puzzles are available in their favorite categories
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button className="bg-puzzle-aqua hover:bg-puzzle-aqua/80">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Email Preview</DialogTitle>
              <DialogDescription>
                Preview how this email will appear to recipients.
              </DialogDescription>
            </DialogHeader>
            {currentTemplate && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">From: Puzzle Boss &lt;noreply@puzzleboss.com&gt;</div>
                  <div className="text-sm text-gray-500">To: {{recipient.email}}</div>
                  <div className="text-sm text-gray-500">Subject: {currentTemplate.subject}</div>
                </div>
                
                <div className="border rounded-md p-4 bg-white min-h-[200px]">
                  <div className="text-center py-10">
                    <MailIcon className="h-10 w-10 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Email content preview will appear here.</p>
                    <p className="text-gray-400 text-sm">Placeholder for HTML content</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    <strong>Template Type:</strong> {currentTemplate.type}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Status:</strong> {currentTemplate.status}
                  </p>
                  {currentTemplate.last_sent && (
                    <p className="text-sm text-gray-500">
                      <strong>Last Sent:</strong> {new Date(currentTemplate.last_sent).toLocaleString()}
                    </p>
                  )}
                </div>
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    className="mr-auto"
                    onClick={handleSendTestEmail}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Test Email
                  </Button>
                  <Button 
                    variant="outline"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Template
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

// Label component for the email settings
const Label = ({ children, htmlFor }: { children: React.ReactNode, htmlFor?: string }) => (
  <label 
    htmlFor={htmlFor} 
    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  >
    {children}
  </label>
);

// Checkbox component for the email settings
const Checkbox = ({ id, defaultChecked }: { id: string, defaultChecked?: boolean }) => (
  <input 
    type="checkbox"
    id={id}
    defaultChecked={defaultChecked}
    className="h-4 w-4 rounded border-gray-300 text-puzzle-aqua focus:ring-puzzle-aqua"
  />
);
