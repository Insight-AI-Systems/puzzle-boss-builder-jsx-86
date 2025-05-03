
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { FinanceStats } from '@/components/finance/FinanceStats';
import XeroWebhookManager from '@/components/finance/XeroWebhookManager';
import XeroIntegration from '@/components/finance/XeroIntegration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { XeroService } from '@/services/xero';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';

const CFODashboard: React.FC = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleConnectToXero = async () => {
    try {
      setIsConnecting(true);
      toast({
        title: "Connecting to Xero",
        description: "Initiating connection to Xero...",
      });
      
      const authUrl = await XeroService.initiateAuth();
      window.location.href = authUrl;
    } catch (error) {
      console.error("Failed to connect to Xero:", error);
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "Failed to connect to Xero",
        variant: "destructive",
      });
      setIsConnecting(false);
    }
  };
  
  return (
    <ProtectedRoute requiredRoles={['super_admin', 'cfo', 'admin']}>
      <div className="min-h-screen flex flex-col w-full">
        <Navbar />
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-game text-puzzle-gold">CFO Dashboard</h1>
              <Button 
                onClick={handleConnectToXero} 
                disabled={isConnecting} 
                className="bg-green-600 hover:bg-green-700"
              >
                {isConnecting ? "Connecting..." : "Connect to Xero"}
              </Button>
            </div>
            
            <Tabs defaultValue="overview">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Financial Overview</TabsTrigger>
                <TabsTrigger value="integration">Xero Integration</TabsTrigger>
                <TabsTrigger value="webhooks">Xero Webhooks</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Statistics</CardTitle>
                    <CardDescription>
                      Key financial metrics and performance indicators
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FinanceStats />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="integration">
                <XeroIntegration />
              </TabsContent>
              
              <TabsContent value="webhooks">
                <XeroWebhookManager />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CFODashboard;
