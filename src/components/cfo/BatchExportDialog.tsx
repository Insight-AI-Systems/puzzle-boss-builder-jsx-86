
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CalendarDateRangePicker } from '@/components/ui/date-range-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFinancials } from '@/hooks/useFinancials';
import { exportFinancialData } from '@/utils/exportUtils';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Download } from 'lucide-react';

export const BatchExportDialog = () => {
  const [date, setDate] = useState<DateRange | undefined>();
  const [format, setFormat] = useState<'csv' | 'excel'>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const { fetchSiteIncomes, fetchSiteExpenses, fetchCommissionPayments } = useFinancials();

  const handleExport = async () => {
    if (!date?.from) return;
    
    setIsExporting(true);
    try {
      const startDate = format(date.from, 'yyyy-MM-dd');
      const endDate = date.to ? format(date.to, 'yyyy-MM-dd') : startDate;
      const period = `${format(date.from, 'yyyy-MM')}${date.to ? `-to-${format(date.to, 'yyyy-MM')}` : ''}`;

      const [incomes, expenses, commissions] = await Promise.all([
        fetchSiteIncomes(startDate),
        fetchSiteExpenses(startDate),
        fetchCommissionPayments()
      ]);

      await exportFinancialData(incomes, expenses, commissions, period, format);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Batch Export
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Financial Data</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>
            <CalendarDateRangePicker date={date} onDateChange={setDate} />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Export Format</label>
            <Select value={format} onValueChange={(value: 'csv' | 'excel') => setFormat(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            className="w-full"
            onClick={handleExport} 
            disabled={!date?.from || isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export Data'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
