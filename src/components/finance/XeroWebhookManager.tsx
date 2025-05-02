
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { XeroService } from "@/services/xero";
import { AlertCircle, Plus, RefreshCw, Trash2 } from "lucide-react";
import { format } from "date-fns";

const WEBHOOK_EVENT_TYPES = [
  { value: "invoices.create", label: "Invoice Created" },
  { value: "invoices.update", label: "Invoice Updated" },
  { value: "contacts.create", label: "Contact Created" },
  { value: "contacts.update", label: "Contact Updated" },
  { value: "bills.create", label: "Bill Created" },
  { value: "bills.update", label: "Bill Updated" },
  { value: "banktransactions.create", label: "Transaction Created" },
];

const XeroWebhookManager: React.FC = () => {
  const [isCreatingWebhook, setIsCreatingWebhook] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState<string>(WEBHOOK_EVENT_TYPES[0].value);
  const queryClient = useQueryClient();

  // Get active webhooks
  const {
    data: webhooks = [],
    isLoading: isLoadingWebhooks,
    refetch: refetchWebhooks
  } = useQuery({
    queryKey: ['xero', 'webhooks'],
    queryFn: () => XeroService.getActiveWebhooks(),
  });

  // Get webhook logs
  const {
    data: webhookLogs = [],
    isLoading: isLoadingLogs,
    refetch: refetchLogs
  } = useQuery({
    queryKey: ['xero', 'webhook-logs'],
    queryFn: () => XeroService.getWebhookLogs(),
  });

  // Connection status query
  const { 
    data: connectionStatus,
    isLoading: isLoadingStatus,
  } = useQuery({
    queryKey: ['xero', 'connection-status'],
    queryFn: () => XeroService.getConnectionStatus(),
  });

  const handleRegisterWebhook = async () => {
    try {
      setIsCreatingWebhook(true);
      const result = await XeroService.registerWebhook(selectedEventType);
      
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
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to register webhook:", error);
      toast({
        title: "Registration Error",
        description: error instanceof Error ? error.message : "Failed to register webhook",
        variant: "destructive",
      });
    } finally {
      setIsCreatingWebhook(false);
    }
  };

  const handleDeleteWebhook = async (webhookId: string) => {
    try {
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
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to delete webhook:", error);
      toast({
        title: "Deletion Error",
        description: error instanceof Error ? error.message : "Failed to delete webhook",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm:ss');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Xero Webhooks</CardTitle>
        <CardDescription>
          Manage real-time data synchronization with Xero
        </CardDescription>
        
        {!connectionStatus?.connected && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connection Required</AlertTitle>
            <AlertDescription>
              You must connect to Xero before managing webhooks.
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {connectionStatus?.connected && (
          <>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">Event Type</label>
                <Select 
                  value={selectedEventType} 
                  onValueChange={setSelectedEventType}
                  disabled={isCreatingWebhook}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {WEBHOOK_EVENT_TYPES.map((eventType) => (
                      <SelectItem key={eventType.value} value={eventType.value}>
                        {eventType.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleRegisterWebhook}
                disabled={isCreatingWebhook || !selectedEventType}
              >
                {isCreatingWebhook ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Register Webhook
              </Button>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Active Webhooks</h3>
              
              {isLoadingWebhooks ? (
                <div className="animate-pulse space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-10 bg-gray-100 rounded"></div>
                  ))}
                </div>
              ) : webhooks.length > 0 ? (
                <ScrollArea className="h-[200px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event Type</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {webhooks.map((webhook) => (
                        <TableRow key={webhook.id}>
                          <TableCell>
                            <Badge>{webhook.type}</Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs truncate max-w-[200px]">
                            {webhook.url}
                          </TableCell>
                          <TableCell>
                            {formatDate(webhook.created_at)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteWebhook(webhook.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No active webhooks. Register your first webhook to receive real-time updates from Xero.
                </div>
              )}
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Recent Webhook Events</h3>
                <Button variant="outline" size="sm" onClick={() => refetchLogs()}>
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Refresh
                </Button>
              </div>
              
              {isLoadingLogs ? (
                <div className="animate-pulse space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-10 bg-gray-100 rounded"></div>
                  ))}
                </div>
              ) : webhookLogs.length > 0 ? (
                <ScrollArea className="h-[300px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event Type</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {webhookLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>{log.event_type}</TableCell>
                          <TableCell>{formatDate(log.created_at)}</TableCell>
                          <TableCell>
                            <Badge variant={log.processed ? "default" : "outline"}>
                              {log.processed ? "Processed" : "Pending"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No webhook events received yet.
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default XeroWebhookManager;
