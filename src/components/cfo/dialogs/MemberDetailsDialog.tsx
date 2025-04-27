
import React from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MemberHistoryDetails } from '@/types/membershipTypes';
import { Separator } from '@/components/ui/separator';

interface MemberDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  details: MemberHistoryDetails | null;
  username: string;
}

export function MemberDetailsDialog({ 
  open, 
  onOpenChange, 
  details,
  username 
}: MemberDetailsDialogProps) {
  if (!details) return null;

  const formatDate = (date: string) => format(new Date(date), 'MMM d, yyyy');
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Member Details - {username}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-500">
                  {formatCurrency(details.financialSummary.total_spend)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prizes Won</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-amber-500">
                  {formatCurrency(details.financialSummary.total_prizes)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Membership Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold capitalize">
                  {details.financialSummary.membership_status}
                </p>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Membership History */}
          <Card>
            <CardHeader>
              <CardTitle>Membership History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {details.memberships.map((membership) => (
                    <TableRow key={membership.id}>
                      <TableCell>{formatDate(membership.start_date)}</TableCell>
                      <TableCell>{membership.end_date ? formatDate(membership.end_date) : 'Active'}</TableCell>
                      <TableCell>{formatCurrency(membership.amount)}</TableCell>
                      <TableCell className="capitalize">{membership.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Default</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {details.paymentMethods.map((method) => (
                    <TableRow key={method.id}>
                      <TableCell className="capitalize">{method.method_type}</TableCell>
                      <TableCell>{method.last_used ? formatDate(method.last_used) : 'Never'}</TableCell>
                      <TableCell>{method.is_default ? 'Yes' : 'No'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
