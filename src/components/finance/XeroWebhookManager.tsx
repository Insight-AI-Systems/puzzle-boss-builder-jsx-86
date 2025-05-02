
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { XeroService } from '@/services/xero';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { RefreshCw, Trash2, Bell, AlertCircle, CheckCircle } from 'lucide-react';
import { IntegrationWebhook, WebhookLog } from '@/types/integration';

const WEBHOOK_EVENT_TYPES = [
  { value: 'INVOICE', label: 'Invoices' },
  { value: 'CONTACT', label: 'Contacts' },
  { value: 'BILL', label: 'Bills' },
  { value: 'BANKTRANSACTION', label: 'Bank Transactions' }
];

const XeroWebhookManager: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState('INVOICE');

  // Fetch active webhooks
  const {
    data: webhooks = [],
    isLoading: isLoadingWebhooks,
    refetch: refetchWebhooks
  } = useQuery({
    queryKey: ['xero', 'webhooks'],
    queryFn: () => XeroService.getActiveWebhooks(),
  });

  // Fetch webhook logs
  const {
    data: logs = [],
    isLoading: isLoadingLogs,
    refetch: refetchLogs
  } = useQuery({
    queryKey: ['xero', 'webhook-logs'],
    queryFn: () => XeroService.getWebhookLogs(),
  });

  // Register a webhook handler
  const handleRegisterWebhook = async () => {
    try {
      setIsRegistering(true);
      
      // Check if webhook already exists for this event
      const existingWebhook = webhooks.find(
        (webhook: IntegrationWebhook) => webhook.type === selectedEvent
      );
      
      if (existingWebhook) {
        toast({
          title: "Webhook already exists",
          description: `A webhook for ${selectedEvent} events already exists.`,
          variant: "destructive"
        });
        return;
      }
      
      const result = await XeroService.registerWebhook(selectedEvent);
      
      if (result.success) {
        toast({
          title: "Webhook Registered",
          description: result.message,
        });
        refetchWebhooks();
      } else {
        toast({
          title: "Registration Failed",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error registering webhook:', error);
      toast({
        title: "Registration Error",
        description: error instanceof Error ? error.message : "Failed to register webhook",
        variant: "destructive"
      });
    } finally {
      setIsRegistering(false);
    }
  };
  
  // Delete a webhook handler
  const handleDeleteWebhook = async (webhookId: string) => {
    try {
      setIsDeleting(webhookId);
      
      const result = await XeroService.deleteWebhook(webhookId);
      
      if (result.success) {
        toast({
          title: "Webhook Deleted",
          description: result.message,
        });
        refetchWebhooks();
      } else {
        toast({
          title: "Deletion Failed",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting webhook:', error);
      toast({
        title: "Deletion Error",
        description: error instanceof Error ? error.message : "Failed to delete webhook",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(null);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Xero Webhooks</CardTitle>
          <CardDescription>
            Register webhooks to automatically sync data when changes occur in Xero
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4 mb-6">
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium">Event Type</label>
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {WEBHOOK_EVENT_TYPES.map((event) => (
                    <SelectItem key={event.value} value={event.value}>
                      {event.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleRegisterWebhook} 
              disabled={isRegistering || !selectedEvent}
              className="mb-1"
            >
              {isRegistering ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <Bell className="mr-2 h-4 w-4" />
                  Register Webhook
                </>
              )}
            </Button>
          </div>
          
          <h3 className="text-sm font-medium mb-2">Active Webhooks</h3>
          <ScrollArea className="h-[200px] border rounded-md">
            {isLoadingWebhooks ? (
              <div className="flex items-center justify-center h-[200px]">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : webhooks.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {webhooks.map((webhook: IntegrationWebhook) => (
                    <TableRow key={webhook.id}>
                      <TableCell>{webhook.type}</TableCell>
                      <TableCell>{formatDate(webhook.created_at)}</TableCell>
                      <TableCell>
                        <Badge variant={webhook.is_active ? "default" : "outline"}>
                          {webhook.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteWebhook(webhook.id)}
                          disabled={isDeleting === webhook.id}
                        >
                          {isDeleting === webhook.id ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                <Bell className="h-8 w-8 mb-2 opacity-50" />
                <p>No webhooks registered</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Recent Webhook Events</CardTitle>
          <CardDescription>
            History of recent events received from Xero
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] border rounded-md">
            {isLoadingLogs ? (
              <div className="flex items-center justify-center h-[300px]">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : logs.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead>Processed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log: WebhookLog) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.event_type}</TableCell>
                      <TableCell>{formatDate(log.created_at)}</TableCell>
                      <TableCell>
                        {log.processed ? (
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            <span>Processed</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                            <span>Pending</span>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                <Bell className="h-8 w-8 mb-2 opacity-50" />
                <p>No webhook events received</p>
              </div>
            )}
          </ScrollArea>
          <div className="flex justify-end mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetchLogs()}
            >
              <RefreshCw className="mr-2 h-3 w-3" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default XeroWebhookManager;
