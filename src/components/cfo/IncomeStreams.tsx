import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiteIncome, SourceType } from '@/types/financeTypes';
import { useFinancials } from '@/hooks/useFinancials';
import { useFinancialRecords } from '@/hooks/useFinancialRecords';
import { DetailDialog } from './details/DetailDialog';
import { IncomeDetail } from './details/IncomeDetail';

const IncomeStreams: React.FC<{ selectedMonth: string }> = ({ selectedMonth }) => {
  const [incomeData, setIncomeData] = useState<SiteIncome[]>([]);
  const [filteredIncomes, setFilteredIncomes] = useState<SiteIncome[]>([]);
  const [sourceFilter, setSourceFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIncome, setSelectedIncome] = useState<SiteIncome | null>(null);
  const { fetchSiteIncomes, isLoading } = useFinancials();
  const { exportDataToCSV } = useFinancialRecords();

  // Load income data for the selected month
  useEffect(() => {
    const loadIncomeData = async () => {
      const startDate = `${selectedMonth}-01`;
      const endDate = `${selectedMonth}-31`;
      const incomes = await fetchSiteIncomes(startDate, endDate);
      
      // Type-safe handling for incomes
      const typeSafeIncomes: SiteIncome[] = incomes.map(income => ({
        id: income.id,
        source_type: income.source_type,
        amount: income.amount,
        user_id: income.user_id || undefined,
        category_id: income.category_id || undefined,
        date: income.date,
        method: income.method,
        notes: income.notes || undefined,
        profiles: { 
          username: typeof income.profiles === 'object' && income.profiles && 'username' in income.profiles 
            ? income.profiles.username
            : undefined 
        },
        categories: income.categories
      }));
      
      setIncomeData(typeSafeIncomes);
      setFilteredIncomes(typeSafeIncomes);
    };
    
    loadIncomeData();
  }, [selectedMonth, fetchSiteIncomes]);

  // Filter incomes based on source type and search term
  useEffect(() => {
    let filtered = incomeData;
    
    if (sourceFilter) {
      filtered = filtered.filter(income => income.source_type === sourceFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(income => 
        income.profiles?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        income.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredIncomes(filtered);
  }, [incomeData, sourceFilter, searchTerm]);

  const handleExport = () => {
    exportDataToCSV(filteredIncomes, `income-${selectedMonth}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Income Streams</h2>
        <Button onClick={handleExport}>Export to CSV</Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Income Records</CardTitle>
            <div>
              <select 
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 bg-background"
              >
                <option value="">All Sources</option>
                <option value={SourceType.MEMBERSHIP}>Membership</option>
                <option value={SourceType.PUZZLE}>Pay-to-Play</option>
                <option value={SourceType.PRIZE}>Prize</option>
                <option value={SourceType.SPONSORSHIP}>Sponsorship</option>
                <option value={SourceType.OTHER}>Other</option>
              </select>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ml-2 border border-gray-300 rounded px-2 py-1 bg-background"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredIncomes.map((income) => (
                  <tr key={income.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {income.source_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${income.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {income.profiles?.username || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(income.date), 'yyyy-MM-dd')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="link" onClick={() => setSelectedIncome(income)}>
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {selectedIncome && (
        <IncomeDetail
          income={selectedIncome}
          open={!!selectedIncome}
          onOpenChange={(open) => !open && setSelectedIncome(null)}
        />
      )}
    </div>
  );
};

export default IncomeStreams;
