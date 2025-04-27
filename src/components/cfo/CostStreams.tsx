
import React, { useEffect, useState } from 'react';
import { useFinancials } from '@/hooks/useFinancials';
import { SiteExpense, ExpenseType } from '@/types/financeTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { Download, ArrowUpDown } from 'lucide-react';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface CostStreamsProps {
  selectedMonth: string;
}

const CostStreams: React.FC<CostStreamsProps> = ({ selectedMonth }) => {
  const { fetchExpenseRecords, exportDataToCSV, isLoading } = useFinancials();
  const [expenseData, setExpenseData] = useState<SiteExpense[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Chart colors for different expense types
  const COLORS = {
    prizes: '#ef4444',  // red
    salaries: '#f97316',  // orange
    infrastructure: '#3b82f6',  // blue
    commissions: '#8b5cf6',  // purple
    other: '#64748b',  // slate
  };

  useEffect(() => {
    const loadExpenseData = async () => {
      const startDate = format(startOfMonth(parseISO(`${selectedMonth}-01`)), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(parseISO(`${selectedMonth}-01`)), 'yyyy-MM-dd');
      
      const filter = typeFilter !== 'all' ? typeFilter : undefined;
      const data = await fetchExpenseRecords(startDate, endDate, filter);
      setExpenseData(data);
    };
    
    loadExpenseData();
  }, [selectedMonth, typeFilter]);

  // Column definitions for table
  const columns: ColumnDef<SiteExpense>[] = [
    {
      accessorKey: 'date',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => format(parseISO(row.getValue('date')), 'MMM dd, yyyy'),
    },
    {
      accessorKey: 'expense_type',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div 
          className="px-2 py-1 rounded-full text-xs font-medium w-fit"
          style={{ 
            backgroundColor: COLORS[row.getValue('expense_type') as keyof typeof COLORS] + '20',
            color: COLORS[row.getValue('expense_type') as keyof typeof COLORS] 
          }}
        >
          {row.getValue('expense_type')}
        </div>
      ),
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-right font-medium text-red-500">
          ${parseFloat(row.getValue('amount')).toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: 'payee',
      header: 'Payee',
      cell: ({ row }) => row.getValue('payee') || 'N/A',
    },
    {
      accessorKey: 'categories.name',
      header: 'Category',
      cell: ({ row }) => {
        const categories = (row.original as any)?.categories;
        return categories?.name || 'N/A';
      }
    },
    {
      accessorKey: 'notes',
      header: 'Notes',
      cell: ({ row }) => {
        const notes = row.getValue('notes') as string;
        return notes ? notes.slice(0, 25) + (notes.length > 25 ? '...' : '') : 'N/A';
      },
    },
  ];

  const table = useReactTable({
    data: expenseData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  // Calculate aggregated data for charts
  const calculateChartData = () => {
    const aggregated: Record<string, number> = {};
    
    expenseData.forEach(expense => {
      if (!aggregated[expense.expense_type]) {
        aggregated[expense.expense_type] = 0;
      }
      aggregated[expense.expense_type] += expense.amount;
    });
    
    return Object.keys(aggregated).map(key => ({
      name: key,
      value: aggregated[key],
    }));
  };

  const chartData = calculateChartData();

  const handleExportCSV = () => {
    exportDataToCSV(expenseData, `expenses-${selectedMonth}`);
  };

  return (
    <div className="space-y-6">
      {/* Header with filters and export */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-xl font-semibold">Expense Streams</h2>
        
        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={typeFilter}
            onValueChange={setTypeFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="prizes">Prizes</SelectItem>
              <SelectItem value="salaries">Salaries</SelectItem>
              <SelectItem value="infrastructure">Infrastructure</SelectItem>
              <SelectItem value="commissions">Commissions</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expense Distribution Chart */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Expense Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ChartContainer
                config={Object.fromEntries(
                  Object.entries(COLORS).map(([key, value]) => [key, { color: value }])
                )}
                className="aspect-[4/3]"
              >
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar 
                    dataKey="value" 
                    name="Amount"
                    radius={[0, 4, 4, 0]}
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[entry.name as keyof typeof COLORS]} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <p className="text-muted-foreground">No data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expense Data Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Expense Records</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-80 flex items-center justify-center">
                <p>Loading expense data...</p>
              </div>
            ) : (
              <div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
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
                      {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
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
                          <TableCell colSpan={columns.length} className="h-24 text-center">
                            No expense records for this period.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Pagination controls */}
                <div className="flex items-center justify-end space-x-2 py-4">
                  <div className="flex-1 text-sm text-muted-foreground">
                    {`Showing ${table.getRowModel().rows?.length} of ${expenseData.length} records`}
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Card */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Expense Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold text-red-500">
                  ${expenseData.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Number of Transactions</p>
                <p className="text-2xl font-bold">{expenseData.length}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Prize Expenses</p>
                <p className="text-2xl font-bold text-orange-500">
                  ${expenseData
                    .filter(item => item.expense_type === 'prizes')
                    .reduce((sum, item) => sum + item.amount, 0)
                    .toFixed(2)
                  }
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Operating Expenses</p>
                <p className="text-2xl font-bold">
                  ${expenseData
                    .filter(item => item.expense_type !== 'prizes')
                    .reduce((sum, item) => sum + item.amount, 0)
                    .toFixed(2)
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CostStreams;
