
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { XeroService } from "@/services/xero"; // Updated import path
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, CheckCircle, RefreshCw, Link as LinkIcon } from "lucide-react";
import { XeroInvoice, XeroBill, XeroTransaction, XeroContact } from "@/types/integration";
import { format } from "date-fns";

const XeroIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSyncing, setIsSyncing] = useState(false);

  // Connection status query
  const { 
    data: connectionStatus,
    isLoading: isLoadingStatus,
    refetch: refetchConnectionStatus
  } = useQuery({
    queryKey: ['xero', 'connection-status'],
    queryFn: () => XeroService.getConnectionStatus(),
    refetchInterval: 60000 * 5, // Refetch every 5 minutes
  });

  // Invoice data query
  const { 
    data: invoices = [],
    isLoading: isLoadingInvoices,
    refetch: refetchInvoices
  } = useQuery({
    queryKey: ['xero', 'invoices'],
    queryFn: () => XeroService.getInvoices(10, 0),
    enabled: !!connectionStatus?.connected,
  });

  // Bills data query
  const { 
    data: bills = [],
    isLoading: isLoadingBills,
    refetch: refetchBills
  } = useQuery({
    queryKey: ['xero', 'bills'],
    queryFn: () => XeroService.getBills(10, 0),
    enabled: !!connectionStatus?.connected,
  });

  // Transactions data query
  const { 
    data: transactions = [],
    isLoading: isLoadingTransactions,
    refetch: refetchTransactions
  } = useQuery({
    queryKey: ['xero', 'transactions'],
    queryFn: () => XeroService.getTransactions(10, 0),
    enabled: !!connectionStatus?.connected,
  });

  // Contacts data query
  const { 
    data: contacts = [],
    isLoading: isLoadingContacts,
    refetch: refetchContacts
  } = useQuery({
    queryKey: ['xero', 'contacts'],
    queryFn: () => XeroService.getContacts(10, 0),
    enabled: !!connectionStatus?.connected,
  });

  // Effect to check for query parameters on page load (for OAuth callback handling)
  useEffect(() => {
    const url = new URL(window.location.href);
    const xeroConnected = url.searchParams.get("xero_connected");
    const xeroError = url.searchParams.get("xero_error");
    
    if (xeroConnected === "true") {
      toast({
        title: "Connected to Xero",
        description: "Your Xero account has been successfully connected.",
        duration: 5000,
      });
      // Remove query parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      // Refresh connection status
      refetchConnectionStatus();
    } else if (xeroError) {
      toast({
        title: "Xero Connection Error",
        description: decodeURIComponent(xeroError),
        variant: "destructive",
        duration: 5000,
      });
      // Remove query parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [refetchConnectionStatus]);

  // Connect to Xero handler
  const handleConnectXero = async () => {
    try {
      const authUrl = await XeroService.initiateAuth();
      window.location.href = authUrl;
    } catch (error) {
      console.error("Failed to connect to Xero:", error);
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "Failed to connect to Xero",
        variant: "destructive",
      });
    }
  };
  
  // Disconnect from Xero handler
  const handleDisconnect = async () => {
    try {
      const disconnected = await XeroService.disconnect();
      if (disconnected) {
        toast({
          title: "Disconnected from Xero",
          description: "Your Xero connection has been removed.",
        });
        refetchConnectionStatus();
      }
    } catch (error) {
      console.error("Failed to disconnect from Xero:", error);
      toast({
        title: "Disconnection Error",
        description: error instanceof Error ? error.message : "Failed to disconnect from Xero",
        variant: "destructive",
      });
    }
  };
  
  // Sync data from Xero handler
  const handleSync = async (recordType: 'invoices' | 'bills' | 'contacts' | 'transactions' | 'all') => {
    try {
      setIsSyncing(true);
      const result = await XeroService.syncFromXero(recordType);
      
      if (result.success) {
        toast({
          title: "Sync Completed",
          description: result.message,
        });
        
        // Refresh the appropriate data
        if (recordType === 'all' || recordType === 'invoices') refetchInvoices();
        if (recordType === 'all' || recordType === 'bills') refetchBills();
        if (recordType === 'all' || recordType === 'transactions') refetchTransactions();
        if (recordType === 'all' || recordType === 'contacts') refetchContacts();
      } else {
        toast({
          title: "Sync Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(`Failed to sync ${recordType} from Xero:`, error);
      toast({
        title: "Sync Error",
        description: error instanceof Error ? error.message : `Failed to sync ${recordType} from Xero`,
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Xero Integration</CardTitle>
        <CardDescription>Connect and sync data with your Xero accounting system</CardDescription>
        
        {/* Connection Status */}
        {isLoadingStatus ? (
          <div className="animate-pulse h-8 bg-gray-200 rounded w-60"></div>
        ) : connectionStatus?.connected ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Connected to Xero</AlertTitle>
            <AlertDescription className="text-green-700">
              Token expires at {formatDate(connectionStatus.expiresAt || '')}
              <Button variant="outline" size="sm" className="ml-4" onClick={handleDisconnect}>
                Disconnect
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Not connected to Xero</AlertTitle>
            <AlertDescription>
              Connect your Xero account to enable data synchronization.
              <Button variant="outline" size="sm" className="ml-4" onClick={handleConnectXero}>
                Connect to Xero
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>

      <CardContent>
        {connectionStatus?.connected && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="bills">Bills</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Invoices</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{invoices.length}</div>
                    <p className="text-xs text-muted-foreground">synced from Xero</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Bills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{bills.length}</div>
                    <p className="text-xs text-muted-foreground">synced from Xero</p>
                  </CardContent>
                </Card>
              </div>
              
              <Button 
                onClick={() => handleSync('all')} 
                disabled={isSyncing || !connectionStatus?.connected}>
                {isSyncing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync All Data
                  </>
                )}
              </Button>
            </TabsContent>
            
            {/* Invoices Tab */}
            <TabsContent value="invoices">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Recent Invoices</h3>
                <Button 
                  size="sm"
                  onClick={() => handleSync('invoices')} 
                  disabled={isSyncing}>
                  {isSyncing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  <span className="ml-2">Refresh</span>
                </Button>
              </div>
              
              <ScrollArea className="h-[400px]">
                {isLoadingInvoices ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse h-12 bg-gray-100 rounded"></div>
                    ))}
                  </div>
                ) : invoices.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((invoice: XeroInvoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell>{invoice.invoice_number}</TableCell>
                          <TableCell>{formatDate(invoice.date)}</TableCell>
                          <TableCell>{invoice.contact_name}</TableCell>
                          <TableCell>{formatCurrency(invoice.total)}</TableCell>
                          <TableCell>
                            <Badge variant={invoice.status === "PAID" ? "default" : "outline"}>
                              {invoice.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No invoices found. Click Refresh to sync data from Xero.
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            
            {/* Bills Tab */}
            <TabsContent value="bills">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Recent Bills</h3>
                <Button 
                  size="sm"
                  onClick={() => handleSync('bills')} 
                  disabled={isSyncing}>
                  {isSyncing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  <span className="ml-2">Refresh</span>
                </Button>
              </div>
              
              <ScrollArea className="h-[400px]">
                {isLoadingBills ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse h-12 bg-gray-100 rounded"></div>
                    ))}
                  </div>
                ) : bills.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bill #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bills.map((bill: XeroBill) => (
                        <TableRow key={bill.id}>
                          <TableCell>{bill.bill_number}</TableCell>
                          <TableCell>{formatDate(bill.date)}</TableCell>
                          <TableCell>{bill.vendor_name}</TableCell>
                          <TableCell>{formatCurrency(bill.total)}</TableCell>
                          <TableCell>
                            <Badge variant={bill.status === "PAID" ? "default" : "outline"}>
                              {bill.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No bills found. Click Refresh to sync data from Xero.
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            
            {/* Contacts Tab */}
            <TabsContent value="contacts">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Contacts</h3>
                <Button 
                  size="sm"
                  onClick={() => handleSync('contacts')} 
                  disabled={isSyncing}>
                  {isSyncing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  <span className="ml-2">Refresh</span>
                </Button>
              </div>
              
              <ScrollArea className="h-[400px]">
                {isLoadingContacts ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse h-12 bg-gray-100 rounded"></div>
                    ))}
                  </div>
                ) : contacts.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contacts.map((contact: XeroContact) => (
                        <TableRow key={contact.id}>
                          <TableCell>{contact.name}</TableCell>
                          <TableCell>{contact.email || '-'}</TableCell>
                          <TableCell>
                            {contact.is_customer && contact.is_supplier ? 'Both' : 
                             contact.is_customer ? 'Customer' : 
                             contact.is_supplier ? 'Supplier' : 'Other'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={contact.status === "ACTIVE" ? "default" : "outline"}>
                              {contact.status || 'UNKNOWN'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No contacts found. Click Refresh to sync data from Xero.
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col items-start">
        <p className="text-sm text-muted-foreground mb-2">
          <LinkIcon className="h-3 w-3 inline-block mr-1" />
          This integration uses the official Xero API for secure data synchronization.
        </p>
      </CardFooter>
    </Card>
  );
};

// Changed to default export to fix the import error in CFODashboard.tsx
export default XeroIntegration;
