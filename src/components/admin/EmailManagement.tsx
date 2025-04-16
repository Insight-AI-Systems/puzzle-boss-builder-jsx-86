import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Search, Plus, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TemplateList } from './email/TemplateList';
import { CampaignList } from './email/CampaignList';
import { EmailSettings } from './email/EmailSettings';
import { TemplateDialog } from './email/TemplateDialog';
import { EmailTemplate, EmailCampaign } from './email/types';

// Mock data moved to the top
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

export const EmailManagement: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('templates');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);

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

  const handleCreateTemplate = (data: any) => {
    toast({
      title: "Template created",
      description: "Your email template has been created successfully.",
    });
    setIsTemplateDialogOpen(false);
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
              <Mail className="h-4 w-4 mr-2" />
              Email Campaigns
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Mail className="h-4 w-4 mr-2" />
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
                
                <Button 
                  className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 whitespace-nowrap"
                  onClick={() => setIsTemplateDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Template
                </Button>
              </div>

              <TemplateList
                templates={filteredTemplates}
                onPreview={() => {}}
                onDelete={handleDeleteTemplate}
              />
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
                
                <Button className="bg-puzzle-aqua hover:bg-puzzle-aqua/80">
                  <Plus className="h-4 w-4 mr-2" />
                  New Campaign
                </Button>
              </div>

              <CampaignList campaigns={filteredCampaigns} />
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <EmailSettings />
          </TabsContent>
        </Tabs>

        <TemplateDialog
          open={isTemplateDialogOpen}
          onOpenChange={setIsTemplateDialogOpen}
          onSubmit={handleCreateTemplate}
          onSendTest={handleSendTestEmail}
        />
      </CardContent>
    </Card>
  );
};
