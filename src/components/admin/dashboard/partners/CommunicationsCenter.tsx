
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  Calendar,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { useClerkAuth } from '@/hooks/useClerkAuth';

interface Communication {
  id: string;
  partnerId: string;
  type: 'email' | 'phone' | 'meeting' | 'note';
  subject: string;
  content: string;
  createdAt: string;
  createdBy: string;
  status: 'sent' | 'received' | 'scheduled' | 'draft';
}

interface CommunicationsCenterProps {
  partnerId?: string;
}

export function CommunicationsCenter({ partnerId }: CommunicationsCenterProps) {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [newCommunication, setNewCommunication] = useState({
    type: 'email' as const,
    subject: '',
    content: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const { user } = useClerkAuth();

  const handleSendCommunication = async () => {
    if (!newCommunication.subject || !newCommunication.content) return;

    const communication: Communication = {
      id: Date.now().toString(),
      partnerId: partnerId || 'all',
      type: newCommunication.type,
      subject: newCommunication.subject,
      content: newCommunication.content,
      createdAt: new Date().toISOString(),
      createdBy: user?.id || 'unknown',
      status: 'sent'
    };

    setCommunications(prev => [communication, ...prev]);
    setNewCommunication({ type: 'email', subject: '', content: '' });
    setShowNewDialog(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'received': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCommunications = communications.filter(comm => {
    const matchesSearch = comm.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comm.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || comm.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Communications Center</CardTitle>
            <Button onClick={() => setShowNewDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Communication
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search communications..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border rounded px-3 py-2"
              >
                <option value="all">All Types</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="meeting">Meeting</option>
                <option value="note">Note</option>
              </select>
            </div>
          </div>

          {/* Communications List */}
          <div className="space-y-3">
            {filteredCommunications.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No communications found</p>
                <p className="text-sm text-gray-400">Start a conversation with your partners</p>
              </div>
            ) : (
              filteredCommunications.map((comm) => (
                <Card key={comm.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getTypeIcon(comm.type)}
                      <div className="flex-1">
                        <h4 className="font-medium">{comm.subject}</h4>
                        <p className="text-sm text-gray-600 mt-1">{comm.content}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(comm.createdAt).toLocaleDateString()} by {comm.createdBy}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(comm.status)}>
                      {comm.status}
                    </Badge>
                  </div>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* New Communication Dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>New Communication</DialogTitle>
            <DialogDescription>
              Send a message to your partner or schedule a meeting.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                value={newCommunication.type}
                onChange={(e) => setNewCommunication(prev => ({ 
                  ...prev, 
                  type: e.target.value as 'email' | 'phone' | 'meeting' | 'note'
                }))}
                className="w-full border rounded px-3 py-2"
              >
                <option value="email">Email</option>
                <option value="phone">Phone Call</option>
                <option value="meeting">Meeting</option>
                <option value="note">Note</option>
              </select>
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={newCommunication.subject}
                onChange={(e) => setNewCommunication(prev => ({ 
                  ...prev, 
                  subject: e.target.value 
                }))}
                placeholder="Enter subject or title"
              />
            </div>

            <div>
              <Label htmlFor="content">Message</Label>
              <Textarea
                id="content"
                value={newCommunication.content}
                onChange={(e) => setNewCommunication(prev => ({ 
                  ...prev, 
                  content: e.target.value 
                }))}
                placeholder="Enter your message"
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendCommunication}>
                Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CommunicationsCenter;
