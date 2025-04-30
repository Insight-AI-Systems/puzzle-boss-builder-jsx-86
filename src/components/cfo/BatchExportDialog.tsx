
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from '@/hooks/use-toast';
import { exportFinancialData } from '@/utils/exportUtils';

export function BatchExportDialog() {
  const [open, setOpen] = useState(false);
  const [startMonth, setStartMonth] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [exportIncome, setExportIncome] = useState(true);
  const [exportExpenses, setExportExpenses] = useState(true);
  const [exportCommissions, setExportCommissions] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    if (!startMonth || !endMonth) {
      toast({
        title: "Missing Information",
        description: "Please select both start and end months.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Call a function to handle the batch export 
      // We need to update this call to match the exportFinancialData signature
      toast({
        title: "Export Started",
        description: "Preparing financial data from " + startMonth + " to " + endMonth
      });
      
      await exportFinancialData(
        [], // incomeData - empty as we'll fetch it in the function
        [], // expenseData - empty as we'll fetch it in the function
        [], // commissionData - empty as we'll fetch it in the function
        `${startMonth}_to_${endMonth}` // filename prefix
      );
      
      toast({
        title: "Export Complete",
        description: "Your financial data has been exported successfully.",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the financial data.",
        variant: "destructive"
      });
      console.error("Export error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generating available months for selection (past 24 months)
  const getAvailableMonths = () => {
    const months = [];
    const now = new Date();
    for (let i = 0; i < 24; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthValue = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = `${d.toLocaleString('default', { month: 'long' })} ${d.getFullYear()}`;
      months.push({ value: monthValue, label: monthLabel });
    }
    return months;
  };

  const availableMonths = getAvailableMonths();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-2">
          <Download className="mr-2 h-4 w-4" />
          Batch Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Financial Data</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="start-month" className="text-right">
              Start Month
            </Label>
            <Select value={startMonth} onValueChange={setStartMonth}>
              <SelectTrigger id="start-month" className="col-span-3">
                <SelectValue placeholder="Select starting month" />
              </SelectTrigger>
              <SelectContent>
                {availableMonths.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="end-month" className="text-right">
              End Month
            </Label>
            <Select value={endMonth} onValueChange={setEndMonth}>
              <SelectTrigger id="end-month" className="col-span-3">
                <SelectValue placeholder="Select ending month" />
              </SelectTrigger>
              <SelectContent>
                {availableMonths.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right col-span-1">Include</Label>
            <div className="space-y-2 col-span-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="income" checked={exportIncome} onCheckedChange={setExportIncome} />
                <Label htmlFor="income">Income Data</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="expenses" checked={exportExpenses} onCheckedChange={setExportExpenses} />
                <Label htmlFor="expenses">Expense Data</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="commissions" checked={exportCommissions} onCheckedChange={setExportCommissions} />
                <Label htmlFor="commissions">Commission Data</Label>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleExport} disabled={isLoading || !startMonth || !endMonth}>
            {isLoading ? "Exporting..." : "Export Data"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
