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
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { CategoryManager, CommissionPayment, PaymentStatus } from '@/types/financeTypes';
import { useFinancials } from '@/hooks/useFinancials';
import { useCommissionManagement } from '@/hooks/useCommissionManagement';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { Download } from 'lucide-react';
import { InvoiceEmailDialog } from './InvoiceEmailDialog';
import { Checkbox } from "@/components/ui/checkbox";

interface CommissionsManagementProps {
  selectedMonth: string;
}

const CommissionsManagement: React.FC<CommissionsManagementProps> = ({ selectedMonth }) => {
  const {
    fetchCategoryManagers,
    fetchCommissionPayments,
    isLoading: isLoadingFinancials
  } = useFinancials();

  const {
    updatePaymentStatus,
    generateCommissions,
    isLoading: isLoadingCommissions
  } = useCommissionManagement();

  const [managers, setManagers] = useState<CategoryManager[]>([]);
  const [payments, setPayments] = useState<CommissionPayment[]>([]);
  const [filterManager, setFilterManager] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const managersData = await fetchCategoryManagers();
      const paymentsData = await fetchCommissionPayments();
      setManagers(managersData);
      setPayments(paymentsData);
    };
    loadData();
  }, [selectedMonth]);

  const handleGenerateCommissions = async () => {
    await generateCommissions(selectedMonth);
    const updatedPayments = await fetchCommissionPayments();
    setPayments(updatedPayments);
  };

  const handleUpdateStatus = async (paymentId: string, status: PaymentStatus) => {
    await updatePaymentStatus(paymentId, status);
    const updatedPayments = await fetchCommissionPayments();
    setPayments(updatedPayments);
  };

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return 'bg-green-100 text-green-800';
      case PaymentStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case PaymentStatus.APPROVED:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPayments = payments.filter(payment => {
    return (!filterManager || payment.manager_name.toLowerCase().includes(filterManager.toLowerCase())) &&
           (!filterCategory || payment.category_name.toLowerCase().includes(filterCategory.toLowerCase())) &&
           (!filterStatus || payment.payment_status === filterStatus);
  });

  const handleSelectPayment = (paymentId: string) => {
    setSelectedPayments(prev => 
      prev.includes(paymentId) 
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedPayments(checked ? filteredPayments.map(p => p.id) : []);
  };

  const handleEmailSuccess = () => {
    setSelectedPayments([]);
    const loadData = async () => {
      const updatedPayments = await fetchCommissionPayments();
      setPayments(updatedPayments);
    };
    loadData();
  };

  const chartData = payments.map(payment => ({
    name: `${payment.manager_name} - ${format(new Date(payment.period), 'MMM yyyy')}`,
    commission: payment.commission_amount
  }));

  const managerTotals = payments.reduce((acc, payment) => {
    const key = payment.manager_name;
    acc[key] = (acc[key] || 0) + payment.commission_amount;
    return acc;
  }, {} as Record<string, number>);

  const chartConfig = {
    commission: {
      color: '#8884d8'
    }
  };

  const exportToCSV = () => {
    const headers = ['Manager', 'Category', 'Period', 'Gross Income', 'Net Income', 'Commission', 'Status'];
    const csvData = filteredPayments.map(p => [
      p.manager_name,
      p.category_name,
      p.period,
      p.gross_income,
      p.net_income,
      p.commission_amount,
      p.payment_status
    ].join(','));
    
    const csv = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `commissions-${selectedMonth}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Commissions Management</CardTitle>
        <div className="flex gap-2">
          <InvoiceEmailDialog 
            selectedPayments={selectedPayments}
            onSuccess={handleEmailSuccess}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button 
            onClick={handleGenerateCommissions}
            disabled={isLoadingCommissions}
          >
            Generate Commissions
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-4">
          <Input
            placeholder="Filter by manager..."
            value={filterManager}
            onChange={(e) => setFilterManager(e.target.value)}
            className="max-w-xs"
          />
          <Input
            placeholder="Filter by category..."
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="max-w-xs"
          />
          <Select
            value={filterStatus}
            onValueChange={setFilterStatus}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              {Object.values(PaymentStatus).map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedPayments.length === filteredPayments.length && filteredPayments.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Gross Income</TableHead>
                <TableHead>Net Income</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Email Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedPayments.includes(payment.id)}
                      onCheckedChange={() => handleSelectPayment(payment.id)}
                    />
                  </TableCell>
                  <TableCell>{payment.manager_name}</TableCell>
                  <TableCell>{payment.category_name}</TableCell>
                  <TableCell>{format(new Date(payment.period), 'MMM yyyy')}</TableCell>
                  <TableCell>${payment.gross_income.toFixed(2)}</TableCell>
                  <TableCell>${payment.net_income.toFixed(2)}</TableCell>
                  <TableCell className="font-medium text-purple-600">
                    ${payment.commission_amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.payment_status)}`}>
                      {payment.payment_status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {payment.email_status === 'sent' ? (
                      <span className="text-green-600 text-sm">
                        Sent {payment.email_sent_at && new Date(payment.email_sent_at).toLocaleDateString()}
                      </span>
                    ) : payment.email_status === 'error' ? (
                      <span className="text-red-600 text-sm" title={payment.email_error || ''}>
                        Failed to send
                      </span>
                    ) : (
                      <span className="text-gray-500 text-sm">Not sent</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Commission Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="commission" fill="#8884d8" name="Commission Amount" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Commission by Manager</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={Object.entries(managerTotals).map(([name, total]) => ({ name, total }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#8884d8" name="Total Commission" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionsManagement;
