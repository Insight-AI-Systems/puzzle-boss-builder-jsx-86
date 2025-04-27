
import React, { useEffect, useState } from 'react';
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
import { CategoryManager, CommissionPayment } from '@/types/financeTypes';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { HelpCircle } from 'lucide-react';

interface CommissionsManagementProps {
  selectedMonth: string;
}

const CommissionsManagement: React.FC<CommissionsManagementProps> = ({ selectedMonth }) => {
  const {
    fetchCategoryManagers,
    fetchCommissionPayments,
    generateCommissions,
    isLoading
  } = useFinancials();

  const [managers, setManagers] = useState<CategoryManager[]>([]);
  const [payments, setPayments] = useState<CommissionPayment[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const managersData = await fetchCategoryManagers();
      const paymentsData = await fetchCommissionPayments();
      setManagers(managersData);
      setPayments(paymentsData);
    };
    loadData();
  }, []);

  const handleGenerateCommissions = async () => {
    await generateCommissions(selectedMonth);
    const updatedPayments = await fetchCommissionPayments();
    setPayments(updatedPayments);
  };

  // Prepare data for the chart
  const chartData = payments.map(payment => ({
    name: payment.category_name,
    commission: payment.commission_amount
  }));

  const chartConfig = {
    commission: {
      label: 'Commission Amount',
      color: '#8884d8'
    }
  };

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
        <Button onClick={handleGenerateCommissions} disabled={isLoading}>
          Generate Commissions
        </Button>
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
            {payments.map((payment) => (
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

        <ChartContainer className="mt-4" config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
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
