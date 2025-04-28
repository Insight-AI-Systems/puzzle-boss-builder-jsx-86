
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import PartnersList from './PartnersList';
import PartnerDetails from './PartnerDetails';
import ProductManagement from './ProductManagement';
import CommunicationsCenter from './CommunicationsCenter';
import AgreementsManagement from './AgreementsManagement';
import { usePartnerManagement } from '@/hooks/admin/usePartnerManagement';

export const PartnersDashboard: React.FC = () => {
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const { isLoading, error } = usePartnerManagement(selectedPartnerId);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Partner Management Portal</CardTitle>
        <CardDescription>
          Manage partner relationships, products, communications, and agreements
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {error ? (
          <div className="bg-red-50 p-4 rounded-md mb-4">
            <p className="text-red-800">Error: {error}</p>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-puzzle-aqua"></div>
          </div>
        ) : selectedPartnerId ? (
          <Tabs defaultValue="details">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="details">Partner Details</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="communications">Communications</TabsTrigger>
              <TabsTrigger value="agreements">Agreements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <PartnerDetails 
                partnerId={selectedPartnerId} 
                onBack={() => setSelectedPartnerId(null)}
              />
            </TabsContent>
            
            <TabsContent value="products">
              <ProductManagement partnerId={selectedPartnerId} />
            </TabsContent>
            
            <TabsContent value="communications">
              <CommunicationsCenter partnerId={selectedPartnerId} />
            </TabsContent>
            
            <TabsContent value="agreements">
              <AgreementsManagement partnerId={selectedPartnerId} />
            </TabsContent>
          </Tabs>
        ) : (
          <PartnersList onSelectPartner={setSelectedPartnerId} />
        )}
      </CardContent>
    </Card>
  );
};

export default PartnersDashboard;
