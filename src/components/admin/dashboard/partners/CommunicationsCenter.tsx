
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Mail, Phone, Calendar, Users, AlertCircle } from "lucide-react";
import { format } from 'date-fns';
import { usePartnerManagement, PartnerCommunication } from '@/hooks/admin/usePartnerManagement';
import CommunicationDialog from './CommunicationDialog';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';
import EmailTemplates from './EmailTemplates';

interface CommunicationsCenterProps {
  partnerId: string;
}

const CommunicationsCenter: React.FC<CommunicationsCenterProps> = ({ partnerId }) => {
  const { user } = useAuth();
  const { communications, selectedPartner } = usePartnerManagement(partnerId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [communicationType, setCommunicationType] = useState<'email' | 'call' | 'meeting' | 'note'>('email');

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'call':
        return <Phone className="h-4 w-4" />;
      case 'meeting':
        return <Users className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getNameInitials = (name?: string | null) => {
    if (!name) return 'U';
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
    return nameParts[0].substring(0, 2).toUpperCase();
  };

  const handleAddCommunication = (type: 'email' | 'call' | 'meeting' | 'note') => {
    setCommunicationType(type);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Communications</h2>
        <div className="space-x-2">
          <Button 
            variant="outline"
            onClick={() => handleAddCommunication('email')}
          >
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
          <Button 
            variant="outline"
            onClick={() => handleAddCommunication('call')}
          >
            <Phone className="h-4 w-4 mr-2" />
            Call
          </Button>
          <Button 
            variant="outline"
            onClick={() => handleAddCommunication('meeting')}
          >
            <Users className="h-4 w-4 mr-2" />
            Meeting
          </Button>
          <Button 
            variant="default"
            onClick={() => handleAddCommunication('note')}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </div>
      </div>

      <Tabs defaultValue="history" className="w-full">
        <TabsList>
          <TabsTrigger value="history">Communication History</TabsTrigger>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history">
          <Card>
            <CardContent className="p-6">
              {communications && communications.length > 0 ? (
                <div className="space-y-4">
                  {communications.map((comm) => (
                    <div 
                      key={comm.id} 
                      className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {getNameInitials(user?.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{comm.subject}</span>
                            <div className="flex items-center gap-1 text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                              {getTypeIcon(comm.type)}
                              <span className="capitalize">{comm.type}</span>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{formatDate(comm.sent_at)}</span>
                        </div>
                        <div 
                          className="mt-2 text-gray-700 whitespace-pre-wrap"
                          style={{ maxHeight: '200px', overflow: 'auto' }}
                        >
                          {comm.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No communications yet</h3>
                  <p className="text-gray-500 mb-6">
                    Start by sending an email, logging a call, or adding a note about this partner.
                  </p>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline"
                      onClick={() => handleAddCommunication('email')}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleAddCommunication('call')}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button 
                      onClick={() => handleAddCommunication('note')}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Note
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates">
          <EmailTemplates partnerId={partnerId} partnerName={selectedPartner?.company_name} />
        </TabsContent>
      </Tabs>

      <CommunicationDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        partnerId={partnerId}
        type={communicationType}
        partnerEmail={selectedPartner?.email}
        partnerName={selectedPartner?.company_name}
      />
    </div>
  );
};

export default CommunicationsCenter;
