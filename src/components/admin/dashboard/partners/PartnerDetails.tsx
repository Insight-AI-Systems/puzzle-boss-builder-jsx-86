
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  ArrowLeftIcon, 
  Edit2Icon, 
  TrashIcon, 
  Globe, 
  Mail, 
  Phone, 
  MapPin,
  Calendar
} from "lucide-react";
import { format } from 'date-fns';
import { usePartnerManagement, Partner } from '@/hooks/admin/usePartnerManagement';
import AddPartnerDialog from './AddPartnerDialog';
import { Badge } from "@/components/ui/badge";

interface PartnerDetailsProps {
  partnerId: string;
  onBack: () => void;
}

const PartnerDetails: React.FC<PartnerDetailsProps> = ({ partnerId, onBack }) => {
  const { selectedPartner, isLoadingDetails, deletePartner } = usePartnerManagement(partnerId);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const confirmDelete = () => {
    deletePartner(partnerId);
    onBack();
  };

  if (isLoadingDetails) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-puzzle-aqua"></div>
      </div>
    );
  }

  if (!selectedPartner) {
    return (
      <div className="text-center py-8">
        <p>Partner not found or has been removed.</p>
        <Button onClick={onBack} variant="outline" className="mt-4">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Partners
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'prospect':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatStage = (stage: string) => {
    return stage
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Partners
        </Button>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Edit2Icon className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">{selectedPartner.company_name}</h2>
                <p className="text-gray-500">{selectedPartner.description || 'No description provided.'}</p>
              </div>
              <Badge className={`${getStatusColor(selectedPartner.status)}`}>
                {selectedPartner.status.charAt(0).toUpperCase() + selectedPartner.status.slice(1)}
              </Badge>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{selectedPartner.email}</span>
              </div>
              {selectedPartner.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{selectedPartner.phone}</span>
                </div>
              )}
              {selectedPartner.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <a 
                    href={selectedPartner.website.startsWith('http') ? selectedPartner.website : `https://${selectedPartner.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {selectedPartner.website}
                  </a>
                </div>
              )}
              {(selectedPartner.address || selectedPartner.city || selectedPartner.state || selectedPartner.country) && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                  <div>
                    {selectedPartner.address && <div>{selectedPartner.address}</div>}
                    <div>
                      {[
                        selectedPartner.city,
                        selectedPartner.state,
                        selectedPartner.postal_code
                      ].filter(Boolean).join(', ')}
                    </div>
                    {selectedPartner.country && <div>{selectedPartner.country}</div>}
                  </div>
                </div>
              )}
              {selectedPartner.tax_id && (
                <div className="mt-4">
                  <span className="text-sm font-medium text-gray-500">Tax ID: </span>
                  <span>{selectedPartner.tax_id}</span>
                </div>
              )}
            </div>

            {selectedPartner.notes && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                <div className="bg-gray-50 p-3 rounded-md text-gray-700">
                  {selectedPartner.notes}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Onboarding Stage</h3>
              <div className="text-lg font-medium">{formatStage(selectedPartner.onboarding_stage)}</div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Contact Person</h3>
              <div className="text-lg font-medium">{selectedPartner.contact_name}</div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Partner Since</h3>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{formatDate(selectedPartner.created_at)}</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h3>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{formatDate(selectedPartner.updated_at)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Partner</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedPartner.company_name}? This action cannot be undone and will remove all associated products, communications, and agreements.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AddPartnerDialog 
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        editPartner={selectedPartner}
      />
    </div>
  );
};

export default PartnerDetails;
