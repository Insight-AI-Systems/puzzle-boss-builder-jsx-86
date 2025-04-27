import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFinancials } from '@/hooks/useFinancials';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { HelpCircle } from 'lucide-react';

interface CommissionsManagementProps {
  selectedMonth: string;
}

const CommissionsManagement: React.FC<CommissionsManagementProps> = ({ selectedMonth }) => {
  const {
    categoryManagers,
    commissionPayments,
    fetchCategoryManagers,
    fetchCommissionPayments,
    generateCommissionsForMonth,
    isLoading
  } = useFinancials();

  React.useEffect(() => {
    fetchCategoryManagers();
    fetchCommissionPayments();
  }, []);

  const generateCommissions = async () => {
    await generateCommissionsForMonth(selectedMonth);
    await fetchCommissionPayments();
  };

  // Mock data for charts
  const chartData = [
    { name: 'Category A', commission: 2400 },
    { name: 'Category B', commission: 1398 },
    { name: 'Category C', commission: 9800 },
    { name: 'Category D', commission: 3908 },
    { name: 'Category E', commission: 4800 },
    { name: 'Category F', commission: 3800 },
    { name: 'Category G', commission: 4300 },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle>Commissions Management</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Review and manage category manager commissions</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button onClick={generateCommissions}>Generate Commissions</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Period</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Gross Income</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commissionPayments?.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.period}</TableCell>
                <TableCell>{payment.manager_name}</TableCell>
                <TableCell>{payment.category_name}</TableCell>
                <TableCell>${payment.gross_income.toFixed(2)}</TableCell>
                <TableCell>${payment.commission_amount.toFixed(2)}</TableCell>
                <TableCell>{payment.payment_status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <ChartContainer className="mt-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="commission" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CommissionsManagement;
