
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  PlusCircle, 
  FileText, 
  AlertCircle,
  ExternalLink,
  Clock
} from "lucide-react";
import { format } from 'date-fns';
import { usePartnerManagement, PartnerAgreement } from '@/hooks/admin/usePartnerManagement';
import AgreementDialog from './AgreementDialog';
import { Badge } from "@/components/ui/badge";

interface AgreementsManagementProps {
  partnerId: string;
}

const AgreementsManagement: React.FC<AgreementsManagementProps> = ({ partnerId }) => {
  const { agreements, selectedPartner } = usePartnerManagement(partnerId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState<PartnerAgreement | null>(null);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'expired':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'terminated':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'signed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleViewAgreement = (agreement: PartnerAgreement) => {
    setSelectedAgreement(agreement);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Partner Agreements</h2>
        <Button onClick={() => {
          setSelectedAgreement(null);
          setIsDialogOpen(true);
        }}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Agreement
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {agreements && agreements.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agreement Name</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Signed Date</TableHead>
                  <TableHead>Effective Period</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agreements.map((agreement) => (
                  <TableRow key={agreement.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      {agreement.name}
                    </TableCell>
                    <TableCell>{agreement.version}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(agreement.status)}`}>
                        {agreement.status.charAt(0).toUpperCase() + agreement.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {agreement.signed_at ? (
                        formatDate(agreement.signed_at)
                      ) : (
                        <span className="flex items-center text-gray-500 text-sm">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {agreement.effective_from ? (
                        <>
                          {formatDate(agreement.effective_from)}
                          {agreement.effective_to && (
                            <> to {formatDate(agreement.effective_to)}</>
                          )}
                        </>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {agreement.document_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <a 
                              href={agreement.document_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View
                            </a>
                          </Button>
                        )}
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleViewAgreement(agreement)}
                        >
                          Manage
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No agreements yet</h3>
              <p className="text-gray-500 mb-6">
                Create your first agreement to formalize the partnership with {selectedPartner?.company_name}.
              </p>
              <Button onClick={() => {
                setSelectedAgreement(null);
                setIsDialogOpen(true);
              }}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Agreement
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AgreementDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        partnerId={partnerId}
        editAgreement={selectedAgreement}
        partnerName={selectedPartner?.company_name}
      />
    </div>
  );
};

export default AgreementsManagement;
