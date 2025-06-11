
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Calendar,
  DollarSign,
  FileText,
  MessageSquare,
  Edit,
  Trash2
} from 'lucide-react';
import { usePartnerManagement, Partner } from '@/hooks/admin/usePartnerManagement';
import { AddPartnerDialog } from './AddPartnerDialog';
import CommunicationsCenter from './CommunicationsCenter';

interface PartnerDetailsProps {
  partnerId: string;
  onBack: () => void;
}

const PartnerDetails: React.FC<PartnerDetailsProps> = ({ partnerId, onBack }) => {
  const { partners, isLoading } = usePartnerManagement(partnerId);
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-puzzle-aqua"></div>
      </div>
    );
  }

  const partner = partners?.find(p => p.id === partnerId);
  
  if (!partner) {
    return (
      <div className="text-center p-8">
        <p>Partner not found</p>
        <Button onClick={onBack} className="mt-4">Back to Partners</Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'prospect': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Button variant="outline" onClick={onBack} className="mb-4">
            ← Back to Partners
          </Button>
          <h1 className="text-3xl font-bold">{partner.company_name}</h1>
          <p className="text-gray-600">{partner.contact_name}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowEditDialog(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge className={getStatusColor(partner.status)}>
              {partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stage</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {partner.onboarding_stage
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="agreements">Agreements</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Partner Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Company Details
                  </h4>
                  <p><strong>Name:</strong> {partner.company_name}</p>
                  <p><strong>Industry:</strong> Technology</p>
                  <p><strong>Size:</strong> 50-100 employees</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Contact Information
                  </h4>
                  <p><strong>Contact:</strong> {partner.contact_name}</p>
                  <p><strong>Email:</strong> {partner.email}</p>
                  <p><strong>Phone:</strong> {partner.phone || 'Not provided'}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address
                  </h4>
                  <p>{partner.address || 'Address not provided'}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Online Presence
                  </h4>
                  <p><strong>Website:</strong> {partner.website || 'Not provided'}</p>
                </div>
              </div>

              {partner.description && (
                <div className="space-y-2">
                  <h4 className="font-medium">Description</h4>
                  <p className="text-gray-600">{partner.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications">
          <CommunicationsCenter partnerId={partnerId} />
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Products & Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">No products configured yet.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agreements">
          <Card>
            <CardHeader>
              <CardTitle>Agreements & Contracts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">No agreements on file.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <AddPartnerDialog 
        open={showEditDialog} 
        setOpen={setShowEditDialog}
        onAddPartner={(partnerData) => {
          console.log('Updating partner:', partnerData);
          setShowEditDialog(false);
        }}
      />
    </div>
  );
};

export default PartnerDetails;
