import React, { useEffect, useState } from 'react';
import { useFinancials } from '@/hooks/useFinancials';
import { useFinancialRecords } from '@/hooks/useFinancialRecords';
import { SiteIncome, SourceType } from '@/types/financeTypes';
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
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { Download, ArrowUpDown, Calendar } from 'lucide-react';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface IncomeStreamsProps {
  selectedMonth: string;
}

const IncomeStreams: React.FC<{ selectedMonth: string }> = ({ selectedMonth }) => {
  const { fetchSiteIncomes } = useFinancials();
  const { fetchIncomeRecords, exportDataToCSV } = useFinancialRecords();
  const [incomeData, setIncomeData] = useState<SiteIncome[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  // Chart colors for different income sources
  const COLORS = {
    membership: '#10b981',    // Emerald
    'pay-to-play': '#059669', // Green
    sponsorship: '#047857',   // Dark Green
    other: '#064e3b',        // Darker Green
  };

  useEffect(() => {
    const loadIncomeData = async () => {
      const startDate = format(startOfMonth(parseISO(`${selectedMonth}-01`)), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(parseISO(`${selectedMonth}-01`)), 'yyyy-MM-dd');
      
      const filter = sourceFilter !== 'all' ? sourceFilter : undefined;
      const data = await fetchIncomeRecords(startDate, endDate, filter);
      setIncomeData(data);
    };
    
    loadIncomeData();
  }, [selectedMonth, sourceFilter]);

  // Column definitions for table
  const columns: ColumnDef<SiteIncome>[] = [
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
      accessorKey: 'source_type',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Source
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div 
          className="px-2 py-1 rounded-full text-xs font-medium w-fit"
          style={{ 
            backgroundColor: COLORS[row.getValue('source_type') as keyof typeof COLORS] + '20',
            color: COLORS[row.getValue('source_type') as keyof typeof COLORS] 
          }}
        >
          {row.getValue('source_type')}
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
        <div className="text-right font-medium">
          ${parseFloat(row.getValue('amount')).toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: 'method',
      header: 'Method',
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
    data: incomeData,
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
    
    incomeData.forEach(income => {
      if (!aggregated[income.source_type]) {
        aggregated[income.source_type] = 0;
      }
      aggregated[income.source_type] += income.amount;
    });
    
    return Object.keys(aggregated).map(key => ({
      name: key,
      value: aggregated[key],
    }));
  };

  const chartData = calculateChartData();

  const handleExportCSV = () => {
    exportDataToCSV(incomeData, `income-${selectedMonth}`);
  };

  return (
    <div className="space-y-6">
      {/* Header with filters and export */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-xl font-semibold">Income Streams</h2>
        
        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={sourceFilter}
            onValueChange={setSourceFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="membership">Membership</SelectItem>
              <SelectItem value="pay-to-play">Pay to Play</SelectItem>
              <SelectItem value="sponsorship">Sponsorship</SelectItem>
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
        {/* Income Distribution Chart */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Income Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ChartContainer 
                config={Object.fromEntries(
                  Object.entries(COLORS).map(([key, value]) => [key, { color: value }])
                )}
                className="aspect-[4/3]"
              >
                <PieChart>
                  <Pie
                    dataKey="value"
                    nameKey="name"
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => `${entry.name}: $${entry.value.toFixed(0)}`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[entry.name as keyof typeof COLORS]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <p className="text-muted-foreground">No data available</p>
              </div>
            )}
            
            {/* Legend */}
            <div className="mt-6 grid grid-cols-2 gap-2">
              {Object.entries(COLORS).map(([key, color]) => (
                <div key={key} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm capitalize">{key}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Income Data Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Income Records</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-80 flex items-center justify-center">
                <p>Loading income data...</p>
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
                            No income records for this period.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Pagination controls */}
                <div className="flex items-center justify-end space-x-2 py-4">
                  <div className="flex-1 text-sm text-muted-foreground">
                    {`Showing ${table.getRowModel().rows?.length} of ${incomeData.length} records`}
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
            <CardTitle>Monthly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Income</p>
                <p className="text-2xl font-bold text-green-500">
                  ${incomeData.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Number of Transactions</p>
                <p className="text-2xl font-bold">{incomeData.length}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Average Transaction</p>
                <p className="text-2xl font-bold">
                  ${incomeData.length > 0
                    ? (incomeData.reduce((sum, item) => sum + item.amount, 0) / incomeData.length).toFixed(2)
                    : "0.00"
                  }
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Largest Transaction</p>
                <p className="text-2xl font-bold">
                  ${incomeData.length > 0
                    ? Math.max(...incomeData.map(item => item.amount)).toFixed(2)
                    : "0.00"
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

export default IncomeStreams;
