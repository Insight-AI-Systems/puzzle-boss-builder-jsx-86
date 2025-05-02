
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { FinanceStats } from '@/components/finance/FinanceStats';
import { XeroWebhookManager } from '@/components/finance/XeroWebhookManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const CFODashboard: React.FC = () => {
  return (
    <ProtectedRoute requiredRoles={['super_admin', 'cfo', 'admin']}>
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-game text-puzzle-gold mb-6">CFO Dashboard</h1>
          
          <Tabs defaultValue="overview">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Financial Overview</TabsTrigger>
              <TabsTrigger value="webhooks">Xero Integration</TabsTrigger>
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
            
            <TabsContent value="webhooks">
              <XeroWebhookManager />
            </TabsContent>
          </Tabs>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default CFODashboard;
