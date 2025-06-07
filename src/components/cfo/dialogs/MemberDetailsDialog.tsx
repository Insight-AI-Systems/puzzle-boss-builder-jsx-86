
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { MemberDetailedProfile } from '@/types/memberTypes';

interface MemberDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  details: MemberDetailedProfile | null;
  username: string;
}

export const MemberDetailsDialog: React.FC<MemberDetailsDialogProps> = ({
  open,
  onOpenChange,
  details,
  username
}) => {
  if (!details) return null;

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const formatDate = (dateString?: string) => {
    return dateString ? format(new Date(dateString), 'MMM dd, yyyy') : 'N/A';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Member Details: {username}
            <Badge variant={details.membership_details?.status === 'active' ? 'default' : 'secondary'}>
              {details.membership_details?.status || 'No Membership'}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div><strong>Email:</strong> {details.email || 'N/A'}</div>
              <div><strong>Full Name:</strong> {details.full_name || 'N/A'}</div>
              <div><strong>Phone:</strong> {details.phone || 'N/A'}</div>
              <div><strong>Country:</strong> {details.country || 'N/A'}</div>
              <div><strong>Member Since:</strong> {formatDate(details.created_at)}</div>
              <div><strong>Role:</strong> {details.role}</div>
            </CardContent>
          </Card>

          {/* Financial Summary */}
          {details.financial_summary && (
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div><strong>Total Spend:</strong> {formatCurrency(details.financial_summary.total_spend)}</div>
                <div><strong>Total Prizes:</strong> {formatCurrency(details.financial_summary.total_prizes)}</div>
                <div><strong>Membership Revenue:</strong> {formatCurrency(details.financial_summary.membership_revenue)}</div>
                <div><strong>Puzzle Revenue:</strong> {formatCurrency(details.financial_summary.puzzle_revenue)}</div>
                <div><strong>Lifetime Value:</strong> {formatCurrency(details.financial_summary.lifetime_value)}</div>
                <div><strong>Last Payment:</strong> {formatDate(details.financial_summary.last_payment_date)}</div>
              </CardContent>
            </Card>
          )}

          {/* Membership Details */}
          {details.membership_details && (
            <Card>
              <CardHeader>
                <CardTitle>Membership Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div><strong>Status:</strong> 
                  <Badge className="ml-2" variant={details.membership_details.status === 'active' ? 'default' : 'secondary'}>
                    {details.membership_details.status}
                  </Badge>
                </div>
                <div><strong>Start Date:</strong> {formatDate(details.membership_details.start_date)}</div>
                <div><strong>End Date:</strong> {formatDate(details.membership_details.end_date)}</div>
                <div><strong>Auto Renew:</strong> {details.membership_details.auto_renew ? 'Yes' : 'No'}</div>
                {details.membership_details.notes && (
                  <div><strong>Notes:</strong> {details.membership_details.notes}</div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Address Information */}
          {details.addresses && details.addresses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Addresses</CardTitle>
              </CardHeader>
              <CardContent>
                {details.addresses.map((address, index) => (
                  <div key={address.id} className="mb-4 p-3 border rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <strong>{address.address_type}</strong>
                      {address.is_default && <Badge variant="outline">Default</Badge>}
                    </div>
                    <div className="text-sm space-y-1">
                      <div>{address.address_line1}</div>
                      {address.address_line2 && <div>{address.address_line2}</div>}
                      <div>{address.city}, {address.state} {address.postal_code}</div>
                      <div>{address.country}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
