
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Link, RefreshCw } from 'lucide-react';
import { ZapierService } from '@/services/zapierService';
import { useToast } from '@/hooks/use-toast';

interface WebhookConfig {
  type: string;
  url: string;
  label: string;
}

export function XeroIntegration() {
  const [activeTab, setActiveTab] = useState('setup');
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const { toast } = useToast();
  
  // Webhook configurations
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([
    { type: 'income', url: '', label: 'Income Webhook' },
    { type: 'expense', url: '', label: 'Expense Webhook' },
    { type: 'invoice', url: '', label: 'Invoice Webhook' },
    { type: 'bill', url: '', label: 'Bills Webhook' }
  ]);
  
  // Load saved webhook URLs
  useEffect(() => {
    async function loadWebhookUrls() {
      try {
        const updatedWebhooks = [...webhooks];
        
        for (let i = 0; i < updatedWebhooks.length; i++) {
          const url = await ZapierService.getWebhookUrl(updatedWebhooks[i].type);
          if (url) {
            updatedWebhooks[i].url = url;
          }
        }
        
        setWebhooks(updatedWebhooks);
      } catch (error) {
        console.error('Error loading webhook URLs:', error);
      }
    }
    
    loadWebhookUrls();
  }, []);
  
  const handleWebhookChange = (index: number, url: string) => {
    const updatedWebhooks = [...webhooks];
    updatedWebhooks[index].url = url;
    setWebhooks(updatedWebhooks);
  };
  
  const handleSaveWebhook = async (index: number) => {
    const webhook = webhooks[index];
    
    if (!webhook.url.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a webhook URL',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await ZapierService.saveWebhookUrl(webhook.type, webhook.url);
      
      toast({
        title: result.success ? 'Webhook saved' : 'Error',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save webhook',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTestConnection = async (webhookUrl: string) => {
    if (!webhookUrl.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a webhook URL to test',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    setTestResult(null);
    
    try {
      const result = await ZapierService.testConnection(webhookUrl);
      setTestResult(result);
      
      toast({
        title: result.success ? 'Connection successful' : 'Connection failed',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to test connection'
      });
      
      toast({
        title: 'Error',
        description: 'Failed to test connection',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Xero Integration via Zapier</CardTitle>
        <CardDescription>
          Connect your financial data with Xero accounting software using Zapier
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="sync">Data Sync</TabsTrigger>
            <TabsTrigger value="logs">Sync Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup">
            <div className="space-y-6">
              <div className="border rounded-md p-4 bg-muted/20">
                <h3 className="text-lg font-medium">Integration Instructions</h3>
                <ol className="mt-2 space-y-2 ml-4 list-decimal">
                  <li>Sign up for a Zapier account if you don't already have one</li>
                  <li>Create a new Zap that connects Xero to a Webhook</li>
                  <li>Copy the webhook URL from Zapier</li>
                  <li>Paste the URL in the appropriate field below and save</li>
                  <li>Test the connection to ensure everything is working</li>
                </ol>
              </div>
              
              <div className="space-y-6">
                {webhooks.map((webhook, index) => (
                  <div key={webhook.type} className="border rounded-md p-4">
                    <Label htmlFor={`webhook-${webhook.type}`}>{webhook.label}</Label>
                    <div className="flex gap-3 mt-2">
                      <Input
                        id={`webhook-${webhook.type}`}
                        placeholder="Enter Zapier webhook URL"
                        value={webhook.url}
                        onChange={(e) => handleWebhookChange(index, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={() => handleSaveWebhook(index)}
                        disabled={isLoading}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleTestConnection(webhook.url)}
                        disabled={isLoading || !webhook.url}
                      >
                        Test
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {testResult && (
                <Alert variant={testResult.success ? 'default' : 'destructive'}>
                  {testResult.success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>
                    {testResult.success ? 'Connection Successful' : 'Connection Failed'}
                  </AlertTitle>
                  <AlertDescription>{testResult.message}</AlertDescription>
                </Alert>
              )}
              
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => window.open('https://zapier.com/apps/xero/integrations', '_blank')}
                >
                  <Link size={16} />
                  Visit Zapier
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sync">
            <div className="space-y-4">
              <div className="border rounded-md p-4 bg-muted/20">
                <h3 className="text-lg font-medium">Data Synchronization</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage the synchronization of financial data between your platform and Xero
                </p>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-lg">Income Data</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-sm text-muted-foreground">
                      Sync your platform income with Xero
                    </p>
                  </CardContent>
                  <CardFooter className="py-4">
                    <Button 
                      className="w-full flex items-center gap-2"
                      disabled={!webhooks[0].url}
                    >
                      <RefreshCw size={16} />
                      Sync Income Data
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="py-4">
                    <CardTitle className="text-lg">Expense Data</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-sm text-muted-foreground">
                      Sync your platform expenses with Xero
                    </p>
                  </CardContent>
                  <CardFooter className="py-4">
                    <Button 
                      className="w-full flex items-center gap-2"
                      disabled={!webhooks[1].url}
                    >
                      <RefreshCw size={16} />
                      Sync Expense Data
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium">Scheduled Syncing</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Configure automatic syncing of your financial data
                </p>
                
                <div className="mt-4">
                  <Label>Coming soon: Automated scheduled synchronization</Label>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="logs">
            <div className="border rounded-md p-4 bg-muted/20 text-center py-8">
              <h3 className="text-lg font-medium">Sync Logs</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Coming soon: View logs of data synchronization between your platform and Xero
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
