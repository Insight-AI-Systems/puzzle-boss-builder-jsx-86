
import React, { useEffect, useState } from 'react';
import { useFinancials } from '@/hooks/useFinancials';
import { CategoryManager, CommissionPayment, CategoryRevenue, PaymentStatus } from '@/types/financeTypes';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getPaginationRowModel,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { 
  Download, 
  ArrowUpDown, 
  CheckCircle2, 
  Clock, 
  CircleDollarSign,
  XCircle 
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogClose
} from '@/components/ui/dialog';

interface CommissionsManagementProps {
  selectedMonth: string;
}

const CommissionsManagement: React.FC<CommissionsManagementProps> = ({ selectedMonth }) => {
  const { 
    fetchCategoryManagers, 
    fetchCommissionPayments, 
    calculateCategoryRevenue,
    updateCommissionPaymentStatus,
    exportDataToCSV, 
    isLoading 
  } = useFinancials();
  
  const [categoryManagers, setCategoryManagers] = useState<CategoryManager[]>([]);
  const [commissionPayments, setCommissionPayments] = useState<CommissionPayment[]>([]);
  const [categoryRevenues, setCategoryRevenues] = useState<CategoryRevenue[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const managers = await fetchCategoryManagers();
      setCategoryManagers(managers);
      
      const payments = await fetchCommissionPayments(selectedMonth);
      setCommissionPayments(payments);
      
      const revenues = await calculateCategoryRevenue(selectedMonth);
      setCategoryRevenues(revenues);
    };
    
    loadData();
  }, [selectedMonth]);

  // Column definitions for revenue table
  const revenueColumns: ColumnDef<CategoryRevenue>[] = [
    {
      accessorKey: 'category_name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'total_revenue',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Revenue
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-right font-medium text-green-500">
          ${parseFloat(row.getValue('total_revenue')).toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: 'total_costs',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Costs
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-right font-medium text-red-500">
          ${parseFloat(row.getValue('total_costs')).toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: 'net_revenue',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Net Revenue
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-right font-medium">
          ${parseFloat(row.getValue('net_revenue')).toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: 'commission_rate',
      header: 'Rate',
      cell: ({ row }) => (
        <div className="text-right">
          {parseFloat(row.getValue('commission_rate')).toFixed(1)}%
        </div>
      ),
    },
    {
      accessorKey: 'commission_amount',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Commission
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-right font-medium">
          ${parseFloat(row.getValue('commission_amount')).toFixed(2)}
        </div>
      ),
    },
  ];

  // Column definitions for payments table
  const paymentColumns: ColumnDef<CommissionPayment>[] = [
    {
      accessorKey: 'category_name',
      header: 'Category',
      cell: ({ row }) => row.original.category_name || 'N/A',
    },
    {
      accessorKey: 'manager_name',
      header: 'Manager',
      cell: ({ row }) => row.original.manager_name || 'N/A',
    },
    {
      accessorKey: 'period',
      header: 'Period',
      cell: ({ row }) => {
        const period = row.getValue('period') as string;
        return period ? format(new Date(period + '-01'), 'MMMM yyyy') : 'N/A';
      },
    },
    {
      accessorKey: 'gross_income',
      header: 'Gross Income',
      cell: ({ row }) => (
        <div className="text-right">
          ${parseFloat(row.getValue('gross_income')).toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: 'commission_amount',
      header: 'Commission',
      cell: ({ row }) => (
        <div className="text-right font-medium">
          ${parseFloat(row.getValue('commission_amount')).toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: 'payment_status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('payment_status') as PaymentStatus;
        const statusMap = {
          pending: { icon: Clock, color: 'text-orange-500 bg-orange-100', label: 'Pending' },
          processing: { icon: CircleDollarSign, color: 'text-blue-500 bg-blue-100', label: 'Processing' },
          paid: { icon: CheckCircle2, color: 'text-green-500 bg-green-100', label: 'Paid' },
          cancelled: { icon: XCircle, color: 'text-red-500 bg-red-100', label: 'Cancelled' }
        };
        
        const { icon: Icon, color, label } = statusMap[status];
        
        return (
          <div className={`flex items-center justify-center px-2 py-1 rounded-full ${color}`}>
            <Icon className="h-3.5 w-3.5 mr-1" />
            <span className="text-xs font-medium">{label}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'payment_date',
      header: 'Payment Date',
      cell: ({ row }) => {
        const date = row.getValue('payment_date') as string;
        return date ? format(new Date(date), 'MMM dd, yyyy') : 'N/A';
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const payment = row.original;
        const isPaid = payment.payment_status === 'paid';
        const isCancelled = payment.payment_status === 'cancelled';
        
        return (
          <div className="flex justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  disabled={isPaid || isCancelled}
                  onClick={() => setSelectedPaymentId(payment.id!)}
                >
                  Update
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Payment Status</DialogTitle>
                  <DialogDescription>
                    Change the status of this commission payment.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="font-medium">Category:</div>
                    <div className="col-span-3">{payment.category_name}</div>
                    
                    <div className="font-medium">Manager:</div>
                    <div className="col-span-3">{payment.manager_name}</div>
                    
                    <div className="font-medium">Amount:</div>
                    <div className="col-span-3">${payment.commission_amount.toFixed(2)}</div>
                    
                    <div className="font-medium">Current Status:</div>
                    <div className="col-span-3">{payment.payment_status}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium">Change Status To:</div>
                    <div className="flex gap-3">
                      {['processing', 'paid', 'cancelled'].map(status => (
                        <Button
                          key={status}
                          variant="outline"
                          size="sm"
                          disabled={status === payment.payment_status}
                          onClick={async () => {
                            if (selectedPaymentId) {
                              await updateCommissionPaymentStatus(
                                selectedPaymentId,
                                status as PaymentStatus
                              );
                              
                              // Refresh payments data
                              const updatedPayments = await fetchCommissionPayments(selectedMonth);
                              setCommissionPayments(updatedPayments);
                            }
                          }}
                        >
                          {status === 'processing' && <CircleDollarSign className="mr-2 h-4 w-4" />}
                          {status === 'paid' && <CheckCircle2 className="mr-2 h-4 w-4" />}
                          {status === 'cancelled' && <XCircle className="mr-2 h-4 w-4" />}
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );
      },
    },
  ];

  const revenueTable = useReactTable({
    data: categoryRevenues,
    columns: revenueColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  const paymentTable = useReactTable({
    data: commissionPayments,
    columns: paymentColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  const handleExportRevenues = () => {
    exportDataToCSV(categoryRevenues, `category-revenues-${selectedMonth}`);
  };

  const handleExportPayments = () => {
    exportDataToCSV(commissionPayments, `commission-payments-${selectedMonth}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Category Manager Commissions</h2>
      </div>

      {/* Category Revenue Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Category Revenue & Commissions</CardTitle>
            <CardDescription>Performance and commission calculation by category</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleExportRevenues} className="flex items-center gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-60 flex items-center justify-center">
              <p>Loading revenue data...</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {revenueTable.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {revenueTable.getRowModel().rows?.length ? (
                    revenueTable.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={revenueColumns.length} className="h-24 text-center">
                        No revenue data for this period.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Commission Payments Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Commission Payments</CardTitle>
            <CardDescription>Track and manage commission payments to category managers</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleExportPayments} className="flex items-center gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-60 flex items-center justify-center">
              <p>Loading payment data...</p>
            </div>
          ) : (
            <div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    {paymentTable.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {paymentTable.getRowModel().rows?.length ? (
                      paymentTable.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={paymentColumns.length} className="h-24 text-center">
                          No commission payment records for this period.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination controls */}
              <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                  {`Showing ${paymentTable.getRowModel().rows?.length} of ${commissionPayments.length} payments`}
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => paymentTable.previousPage()}
                    disabled={!paymentTable.getCanPreviousPage()}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => paymentTable.nextPage()}
                    disabled={!paymentTable.getCanNextPage()}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Manager Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Category Managers</CardTitle>
          <CardDescription>Active managers and their commission rates</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-60 flex items-center justify-center">
              <p>Loading manager data...</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Manager Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Commission Rate</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryManagers.length > 0 ? (
                    categoryManagers.map((manager) => (
                      <TableRow key={manager.id}>
                        <TableCell>{manager.username || 'Unknown'}</TableCell>
                        <TableCell>{manager.category_name || 'Unknown'}</TableCell>
                        <TableCell>{manager.commission_percent}%</TableCell>
                        <TableCell>
                          {manager.active ? (
                            <span className="flex items-center text-green-500">
                              <CheckCircle2 className="h-4 w-4 mr-1" /> Active
                            </span>
                          ) : (
                            <span className="flex items-center text-red-500">
                              <XCircle className="h-4 w-4 mr-1" /> Inactive
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No category managers found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CommissionsManagement;
