
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CommissionPayment, PaymentStatus } from '@/types/financeTypes';
import { useFinancials } from '@/hooks/useFinancials';
import { useCommissionManagement } from '@/hooks/useCommissionManagement';
import { CommissionHeader } from './commissions/CommissionHeader';
import { CommissionTableHeader } from './commissions/CommissionTableHeader';
import { CommissionTable } from './commissions/CommissionTable';
import { CommissionCharts } from './commissions/CommissionCharts';

interface CommissionsManagementProps {
  selectedMonth: string;
}

const CommissionsManagement: React.FC<CommissionsManagementProps> = ({ selectedMonth }) => {
  const {
    fetchCommissionPayments,
    isLoading: isLoadingFinancials
  } = useFinancials();

  const {
    generateCommissions,
    isLoading: isLoadingCommissions
  } = useCommissionManagement();

  const [payments, setPayments] = useState<CommissionPayment[]>([]);
  const [filterManager, setFilterManager] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const paymentsData = await fetchCommissionPayments();
      setPayments(paymentsData);
    };
    loadData();
  }, [selectedMonth, fetchCommissionPayments]);

  const handleGenerateCommissions = async () => {
    await generateCommissions(selectedMonth);
    const updatedPayments = await fetchCommissionPayments();
    setPayments(updatedPayments);
  };

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

  return (
    <Card>
      <CardContent className="space-y-6">
        <CommissionHeader
          selectedPayments={selectedPayments}
          onGenerateCommissions={handleGenerateCommissions}
          onExportToCSV={exportToCSV}
          onEmailSuccess={handleEmailSuccess}
          isLoadingCommissions={isLoadingCommissions}
        />

        <CommissionTableHeader
          filterManager={filterManager}
          setFilterManager={setFilterManager}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />

        <div className="mb-8">
          <CommissionTable
            payments={filteredPayments}
            selectedPayments={selectedPayments}
            onSelectPayment={handleSelectPayment}
            onSelectAll={handleSelectAll}
            getStatusColor={getStatusColor}
          />
        </div>

        <CommissionCharts payments={filteredPayments} />
      </CardContent>
    </Card>
  );
};

export default CommissionsManagement;
