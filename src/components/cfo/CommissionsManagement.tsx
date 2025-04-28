
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useFinancials } from '@/hooks/useFinancials';
import { useCommissionManagement } from '@/hooks/useCommissionManagement';
import { CommissionTable } from './commissions/CommissionTable';
import { CommissionCharts } from './commissions/CommissionCharts';
import { CommissionHeader } from './commissions/CommissionHeader';
import { ManagerDetailDialog } from './details/ManagerDetailDialog';
import { InvoiceEmailDialog } from './InvoiceEmailDialog';
import { 
  CategoryManager, 
  CommissionPayment, 
  PaymentStatus, 
  SiteIncome, 
  SiteExpense 
} from '@/types/financeTypes';

interface CommissionsManagementProps {
  selectedMonth: string;
}

const CommissionsManagement: React.FC<CommissionsManagementProps> = ({ selectedMonth }) => {
  const [payments, setPayments] = useState<CommissionPayment[]>([]);
  const [managers, setManagers] = useState<CategoryManager[]>([]);
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [filterManager, setFilterManager] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState<boolean>(false);
  const [selectedManager, setSelectedManager] = useState<CommissionPayment | null>(null);
  const [managerIncomes, setManagerIncomes] = useState<SiteIncome[]>([]);
  const [managerExpenses, setManagerExpenses] = useState<SiteExpense[]>([]);
  
  const { toast } = useToast();
  const { 
    fetchCommissionPayments, 
    fetchCategoryManagers, 
    isLoading, 
    error,
    fetchSiteIncomes,
    fetchSiteExpenses
  } = useFinancials();
  const { updatePaymentStatus, generateCommissions, isLoading: isActionLoading } = useCommissionManagement();

  // Fetch commission data
  useEffect(() => {
    const loadCommissionData = async () => {
      const paymentsData = await fetchCommissionPayments();
      setPayments(paymentsData.filter(payment => payment.period === selectedMonth));
      
      const managersData = await fetchCategoryManagers();
      setManagers(managersData);
    };
    
    loadCommissionData();
  }, [selectedMonth, fetchCommissionPayments, fetchCategoryManagers]);

  // Handle manager selection for detailed view
  const handleManagerSelect = async (payment: CommissionPayment) => {
    setSelectedManager(payment);
    
    if (payment.category_id) {
      // Fetch income and expense data for this manager's category
      const startDate = `${selectedMonth}-01`;
      const endDate = `${selectedMonth}-31`;
      
      const incomes = await fetchSiteIncomes(startDate, endDate);
      const expenses = await fetchSiteExpenses(selectedMonth);
      
      setManagerIncomes(incomes.filter(income => income.category_id === payment.category_id));
      setManagerExpenses(expenses.filter(expense => expense.category_id === payment.category_id));
    }
  };

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case PaymentStatus.APPROVED:
        return 'bg-blue-100 text-blue-800';
      case PaymentStatus.PAID:
        return 'bg-green-100 text-green-800';
      case PaymentStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (filterManager && !payment.manager_name?.toLowerCase().includes(filterManager.toLowerCase())) return false;
    if (filterCategory && !payment.category_name?.toLowerCase().includes(filterCategory.toLowerCase())) return false;
    if (filterStatus && payment.payment_status !== filterStatus) return false;
    return true;
  });

  // Handler function for sending email
  const handleEmailSuccess = () => {
    // Refresh data after emails are sent
    const loadCommissionData = async () => {
      const paymentsData = await fetchCommissionPayments();
      setPayments(paymentsData.filter(payment => payment.period === selectedMonth));
    };
    
    loadCommissionData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Commissions Management</h2>
        <div className="flex gap-2">
          <InvoiceEmailDialog 
            selectedPayments={selectedPayments}
            onSuccess={handleEmailSuccess}
          />
          <Button
            variant="outline"
            onClick={() => {
              // Add export functionality
              const csvContent = filteredPayments
                .map(payment => 
                  `${payment.manager_name},${payment.category_name},${payment.period},${payment.commission_amount},${payment.payment_status}`
                )
                .join('\n');
              const csv = "Manager,Category,Period,Commission Amount,Status\n" + csvContent;
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.setAttribute('href', url);
              a.setAttribute('download', `commissions-${selectedMonth}.csv`);
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}
            className="flex items-center gap-2"
          >
            Export
          </Button>
          <Button 
            onClick={async () => {
              setIsGenerateDialogOpen(true);
            }}
            disabled={isActionLoading}
          >
            Generate Commissions
          </Button>
        </div>
      </div>
      
      <CommissionCharts payments={payments} />

      <Card>
        <CardHeader>
          <CardTitle>Commission Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <CommissionTable 
            payments={filteredPayments}
            selectedPayments={selectedPayments}
            onSelectPayment={(id) => {
              setSelectedPayments(prev => 
                prev.includes(id) ? prev.filter(paymentId => paymentId !== id) : [...prev, id]
              );
            }}
            onSelectAll={(checked) => {
              setSelectedPayments(checked ? filteredPayments.map(p => p.id) : []);
            }}
            getStatusColor={getStatusColor}
            onManagerSelect={handleManagerSelect}
          />
        </CardContent>
      </Card>

      {/* Generate Commissions Dialog */}
      <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Generate Commissions</h3>
          <p>Are you sure you want to generate commission calculations for {format(new Date(`${selectedMonth}-01`), 'MMMM yyyy')}?</p>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsGenerateDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={async () => {
                await generateCommissions(selectedMonth);
                const updatedPayments = await fetchCommissionPayments();
                setPayments(updatedPayments.filter(payment => payment.period === selectedMonth));
                setIsGenerateDialogOpen(false);
              }}
            >
              {isActionLoading ? 'Generating...' : 'Generate'}
            </Button>
          </div>
        </div>
      </Dialog>
      
      {/* Manager Detail Dialog */}
      {selectedManager && (
        <ManagerDetailDialog
          open={!!selectedManager}
          onOpenChange={(open) => !open && setSelectedManager(null)}
          manager={selectedManager}
          incomes={managerIncomes}
          expenses={managerExpenses}
          statusColors={{
            [PaymentStatus.PENDING]: getStatusColor(PaymentStatus.PENDING),
            [PaymentStatus.APPROVED]: getStatusColor(PaymentStatus.APPROVED),
            [PaymentStatus.PAID]: getStatusColor(PaymentStatus.PAID),
            [PaymentStatus.REJECTED]: getStatusColor(PaymentStatus.REJECTED)
          }}
          onStatusChange={async (status) => {
            if (selectedManager) {
              await updatePaymentStatus(selectedManager.id, status);
              const updatedPayments = await fetchCommissionPayments();
              setPayments(updatedPayments.filter(payment => payment.period === selectedMonth));
            }
          }}
        />
      )}
    </div>
  );
};

export default CommissionsManagement;
