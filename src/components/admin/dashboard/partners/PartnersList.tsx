
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { 
  PlusCircle, 
  Search, 
  ChevronRight, 
  FilterIcon 
} from "lucide-react";
import { usePartnerManagement, Partner } from '@/hooks/admin/usePartnerManagement';
import { AddPartnerDialog } from './AddPartnerDialog';

interface PartnersListProps {
  onSelectPartner: (partnerId: string) => void;
}

const PartnersList: React.FC<PartnersListProps> = ({ onSelectPartner }) => {
  const { partners, isLoading } = usePartnerManagement(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Filter partners based on search term and status filter
  const filteredPartners = React.useMemo(() => {
    if (!partners) return [];

    return partners.filter(partner => {
      const matchesSearch = 
        partner.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || partner.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [partners, searchTerm, statusFilter]);

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
  };

  const getStatusClassName = (status: string) => {
    switch (status) {
      case 'prospect':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search partners..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <FilterIcon className="h-4 w-4 text-gray-500" />
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="prospect">Prospect</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Partner
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-puzzle-aqua"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredPartners.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    {searchTerm || statusFilter !== 'all' ? 
                      "No partners match your search criteria." :
                      "No partners available. Add your first partner to get started."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredPartners.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell className="font-medium">{partner.company_name}</TableCell>
                    <TableCell>
                      <div>{partner.contact_name}</div>
                      <div className="text-sm text-gray-500">{partner.email}</div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClassName(partner.status)}`}>
                        {partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {partner.onboarding_stage
                        .split('_')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onSelectPartner(partner.id)}
                      >
                        Manage
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddPartnerDialog 
        open={showAddDialog} 
        setOpen={setShowAddDialog}
        onAddPartner={(partnerData) => {
          console.log('Adding partner:', partnerData);
          setShowAddDialog(false);
        }}
      />
    </div>
  );
};

export default PartnersList;
