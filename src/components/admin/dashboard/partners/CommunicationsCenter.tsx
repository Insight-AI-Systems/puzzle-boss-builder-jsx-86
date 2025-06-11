import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Send, Search, Filter, Plus, Calendar, User, Phone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useClerkAuth } from '@/hooks/useClerkAuth';

interface Communication {
  id: string;
  type: 'email' | 'sms' | 'push';
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  createdAt: string;
  scheduledAt?: string;
  sentAt?: string;
}

const mockCommunications: Communication[] = [
  {
    id: '1',
    type: 'email',
    subject: 'Welcome to Our Partner Program',
    content: 'Dear Partner, welcome aboard! We are excited to have you...',
    status: 'sent',
    createdAt: '2024-01-20',
    sentAt: '2024-01-21'
  },
  {
    id: '2',
    type: 'sms',
    subject: 'Reminder: Training Session',
    content: 'Hi Partner, remember our training session tomorrow at 10 AM...',
    status: 'scheduled',
    createdAt: '2024-01-22',
    scheduledAt: '2024-01-24'
  },
  {
    id: '3',
    type: 'push',
    subject: 'New Resources Available',
    content: 'Check out the new marketing resources available in the partner portal...',
    status: 'draft',
    createdAt: '2024-01-25'
  }
];

export function CommunicationsCenter() {
  const { user } = useClerkAuth();
  const { toast } = useToast();
  const [communications, setCommunications] = useState<Communication[]>(mockCommunications);
  const [activeTab, setActiveTab] = useState<'all' | 'email' | 'sms' | 'push'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'draft' | 'scheduled' | 'sent' | 'failed'>('all');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [newCommunication, setNewCommunication] = useState<Omit<Communication, 'id' | 'createdAt' | 'sentAt'>>({
    type: 'email',
    subject: '',
    content: '',
    status: 'draft'
  });

  useEffect(() => {
    // Simulate fetching communications from an API
    // In a real application, you would fetch data from your backend here
    // and update the `communications` state with the fetched data.
  }, []);

  const handleComposeOpen = () => {
    setIsComposeOpen(true);
  };

  const handleComposeClose = () => {
    setIsComposeOpen(false);
    setNewCommunication({
      type: 'email',
      subject: '',
      content: '',
      status: 'draft'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCommunication(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: string, name: string) => {
    setNewCommunication(prev => ({
      ...prev,
      [name]: e
    }));
  };

  const handleSendCommunication = () => {
    // Simulate sending a communication
    const newId = Math.random().toString(36).substring(7);
    const now = new Date().toISOString();
    const communication: Communication = {
      id: newId,
      ...newCommunication,
      createdAt: now,
      sentAt: newCommunication.status === 'sent' ? now : undefined
    };

    setCommunications(prev => [...prev, communication]);
    handleComposeClose();

    toast({
      title: 'Communication Sent',
      description: `Your ${newCommunication.type} has been sent successfully.`,
      duration: 3000
    });
  };

  const filteredCommunications = communications.filter(communication => {
    const matchesSearch = communication.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           communication.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || communication.type === activeTab;
    const matchesStatus = selectedStatus === 'all' || communication.status === selectedStatus;
    return matchesSearch && matchesTab && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Communications Center</CardTitle>
          <Button onClick={handleComposeOpen} className="bg-puzzle-aqua hover:bg-puzzle-aqua/80">
            <Plus className="w-4 h-4 mr-2" />
            Compose
          </Button>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search communications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedStatus} onValueChange={(e) => setSelectedStatus(e as any)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Communications List */}
          <Tabs value={activeTab} onValueChange={(e) => setActiveTab(e as any)} className="w-full">
            <TabsList className="grid grid-cols-4 bg-gray-800 text-gray-400">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="sms">SMS</TabsTrigger>
              <TabsTrigger value="push">Push</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              {filteredCommunications.map(communication => (
                <CommunicationItem key={communication.id} communication={communication} />
              ))}
            </TabsContent>
            <TabsContent value="email">
              {filteredCommunications.filter(c => c.type === 'email').map(communication => (
                <CommunicationItem key={communication.id} communication={communication} />
              ))}
            </TabsContent>
            <TabsContent value="sms">
              {filteredCommunications.filter(c => c.type === 'sms').map(communication => (
                <CommunicationItem key={communication.id} communication={communication} />
              ))}
            </TabsContent>
            <TabsContent value="push">
              {filteredCommunications.filter(c => c.type === 'push').map(communication => (
                <CommunicationItem key={communication.id} communication={communication} />
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Compose Communication Dialog */}
      <ComposeCommunicationDialog
        isOpen={isComposeOpen}
        onClose={handleComposeClose}
        communication={newCommunication}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
        onSend={handleSendCommunication}
      />
    </div>
  );
}

interface CommunicationItemProps {
  communication: Communication;
}

const CommunicationItem: React.FC<CommunicationItemProps> = ({ communication }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4 mr-2" />;
      case 'sms': return <Phone className="w-4 h-4 mr-2" />;
      case 'push': return <MessageSquare className="w-4 h-4 mr-2" />;
      default: return null;
    }
  };

  return (
    <Card className="mb-2 bg-gray-900 border-gray-700">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center">
          {getIcon(communication.type)}
          <CardTitle className="text-sm">{communication.subject}</CardTitle>
        </div>
        <Badge variant="secondary">{communication.status}</Badge>
      </CardHeader>
      <CardContent className="text-sm text-gray-400">
        {communication.content.substring(0, 100)}...
      </CardContent>
    </Card>
  );
};

interface ComposeCommunicationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  communication: Omit<Communication, 'id' | 'createdAt' | 'sentAt'>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (e: string, name: string) => void;
  onSend: () => void;
}

const ComposeCommunicationDialog: React.FC<ComposeCommunicationDialogProps> = ({
  isOpen,
  onClose,
  communication,
  onInputChange,
  onSelectChange,
  onSend
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Compose Communication</DialogTitle>
          <DialogDescription>
            Create and send a new communication to partners.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select value={communication.type} onValueChange={(e) => onSelectChange(e, 'type')}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="push">Push Notification</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">
              Subject
            </Label>
            <Input
              type="text"
              id="subject"
              name="subject"
              value={communication.subject}
              onChange={onInputChange}
              className="col-span-3 bg-gray-700 border-gray-600"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="content" className="text-right">
              Content
            </Label>
            <Textarea
              id="content"
              name="content"
              value={communication.content}
              onChange={onInputChange}
              className="col-span-3 bg-gray-700 border-gray-600"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select value={communication.status} onValueChange={(e) => onSelectChange(e, 'status')}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSend} className="bg-puzzle-aqua hover:bg-puzzle-aqua/80">Send</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
