
import React, { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Download, Plus, RefreshCw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { CommissionPayment } from '@/types/finance';

export function FinanceCommissions() {
  const { 
    commissions, 
    generateCommissions, 
    updateCommissionStatus, 
    exportData, 
    isLoading,
    currentPeriod
  } = useFinance();
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter commissions
  const filteredCommissions = commissions.filter((commission) => {
    if (!searchTerm) return true;
    const searchTermLower = searchTerm.toLowerCase();
    
    return (
      commission.manager_name?.toLowerCase().includes(searchTermLower) ||
      commission.category_name?.toLowerCase().includes(searchTermLower) ||
      commission.payment_status?.toLowerCase().includes(searchTermLower)
    );
  });
  
  // Calculate totals
  const totalCommissions = filteredCommissions.reduce(
    (acc, commission) => acc + commission.commission_amount,
    0
  );
  
  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Search commissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => generateCommissions()}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Calculate Commissions
          </Button>
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2 self-start"
          onClick={exportData}
        >
          <Download className="h-4 w-4" />
          Export Commission Data
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Commission Summary - {currentPeriod.label}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Total Commissions</p>
              <p className="text-2xl font-bold">${totalCommissions.toFixed(2)}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Pending Commissions</p>
              <p className="text-2xl font-bold">
                ${filteredCommissions
                  .filter((c) => c.payment_status === 'pending')
                  .reduce((acc, c) => acc + c.commission_amount, 0)
                  .toFixed(2)}
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Paid Commissions</p>
              <p className="text-2xl font-bold">
                ${filteredCommissions
                  .filter((c) => c.payment_status === 'paid')
                  .reduce((acc, c) => acc + c.commission_amount, 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Manager</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Gross Income</TableHead>
                  <TableHead>Net Income</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCommissions.length > 0 ? (
                  filteredCommissions.map((commission) => (
                    <TableRow key={commission.id}>
                      <TableCell>{commission.manager_name}</TableCell>
                      <TableCell>{commission.category_name}</TableCell>
                      <TableCell>${commission.gross_income.toFixed(2)}</TableCell>
                      <TableCell>${commission.net_income.toFixed(2)}</TableCell>
                      <TableCell>${commission.commission_amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          className={`${getStatusColor(
                            commission.payment_status
                          )} hover:${getStatusColor(commission.payment_status)}`}
                        >
                          {commission.payment_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() =>
                                updateCommissionStatus(commission.id, 'approved')
                              }
                              disabled={commission.payment_status === 'approved'}
                            >
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                updateCommissionStatus(commission.id, 'paid')
                              }
                              disabled={commission.payment_status === 'paid'}
                            >
                              Mark as Paid
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                updateCommissionStatus(commission.id, 'rejected')
                              }
                              disabled={commission.payment_status === 'rejected'}
                            >
                              Reject
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                updateCommissionStatus(commission.id, 'pending')
                              }
                              disabled={commission.payment_status === 'pending'}
                            >
                              Reset to Pending
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No commission records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
