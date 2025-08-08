import { supabase } from '@/integrations/supabase/client';
import { 
  SiteIncome, 
  SiteExpense, 
  MonthlyFinancialSummary, 
  CategoryManager, 
  CommissionPayment,
  FinancialPeriod
} from '@/types/finance';
import { format, lastDayOfMonth } from 'date-fns';

/**
 * Core finance service that handles all financial data operations
 */
export class FinanceService {
  /**
   * Get monthly financial summary for a specific period
   * @param period - Month in YYYY-MM format
   */
  static async getFinancialSummary(period: string): Promise<MonthlyFinancialSummary> {
    try {
      // Call the stored function to get financial data
      const { data: summaryData, error: summaryError } = await supabase
        .rpc('get_monthly_financial_summary', { month_param: period });
      
      console.log('[FINANCE SERVICE] Monthly summary query result:', { 
        data: summaryData, 
        error: summaryError ? { code: summaryError.code, message: summaryError.message } : null 
      });
      
      if (summaryError) {
        console.error('[FINANCE SERVICE] Error fetching monthly summary:', summaryError);
        throw summaryError;
      }
      
      if (summaryData && summaryData[0]) {
        // Access the first item in the array
        const firstItem = summaryData[0];
        
        return {
          period: firstItem.period || period,
          total_income: firstItem.total_income || 0,
          total_expenses: firstItem.total_expenses || 0,
          net_profit: firstItem.net_profit || 0,
          commissions_paid: firstItem.commissions_paid || 0,
          prize_expenses: firstItem.prize_expenses || 0
        };
      }
      
      // If no data found, return a default summary
      return this.createDefaultSummary(period);
    } catch (error) {
      console.error('[FINANCE SERVICE] Exception in getFinancialSummary:', error);
      throw error;
    }
  }

  /**
   * Get income data for a date range
   * @param startDate - Start date (YYYY-MM-DD)
   * @param endDate - End date (YYYY-MM-DD)
   * @param sourceType - Optional filter by income source type
   */
  static async getIncomes(
    startDate: string,
    endDate: string,
    sourceType?: string
  ): Promise<SiteIncome[]> {
    try {
      console.log(`[FINANCE SERVICE] Fetching incomes from ${startDate} to ${endDate}`);
      
      let query = supabase
        .from('site_income')
        .select(`
          *,
          categories:category_id (name)
        `)
        .gte('date', startDate)
        .lte('date', endDate);

      if (sourceType) {
        query = query.eq('source_type', sourceType);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('[FINANCE SERVICE] Error fetching incomes:', error);
        throw error;
      }
      
      console.log(`[FINANCE SERVICE] Retrieved ${data?.length || 0} income records`);
      
      return data?.map(item => ({
        ...item,
        amount: item.amount || 0,
        source_type: item.source_type || 'other',
        method: item.method || 'unknown',
        categories: item.categories || { name: 'Unknown' },
        profiles: { username: 'Unknown' }
      })) || [];
    } catch (error) {
      console.error('[FINANCE SERVICE] Exception in getIncomes:', error);
      throw error;
    }
  }

  /**
   * Get expense data for a specific month
   * @param month - Month in YYYY-MM format
   * @param expenseType - Optional filter by expense type
   */
  static async getExpenses(month: string, expenseType?: string): Promise<SiteExpense[]> {
    try {
      // Calculate date range for the month (YYYY-MM format)
      const startDate = `${month}-01`;
      const year = parseInt(month.substring(0, 4));
      const monthNum = parseInt(month.substring(5, 7));
      const lastDay = new Date(year, monthNum, 0).getDate();
      const endDate = `${month}-${lastDay}`;
      
      console.log(`[FINANCE SERVICE] Fetching expenses from ${startDate} to ${endDate}`);
      
      let query = supabase
        .from('site_expenses')
        .select(`
          *,
          categories:category_id (name)
        `)
        .gte('date', startDate)
        .lte('date', endDate);

      if (expenseType) {
        query = query.eq('expense_type', expenseType);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('[FINANCE SERVICE] Error fetching expenses:', error);
        throw error;
      }
      
      console.log(`[FINANCE SERVICE] Retrieved ${data?.length || 0} expense records`);
      
      return data?.map(item => ({
        ...item,
        amount: item.amount || 0,
        expense_type: item.expense_type || 'other',
        payee: item.payee || 'Unknown',
        categories: item.categories || { name: 'Unknown' }
      })) || [];
    } catch (error) {
      console.error('[FINANCE SERVICE] Exception in getExpenses:', error);
      throw error;
    }
  }

  /**
   * Get commission payments
   * @param period - Optional filter by period (YYYY-MM format)
   */
  static async getCommissionPayments(period?: string): Promise<CommissionPayment[]> {
    try {
      console.log('[FINANCE SERVICE] Fetching commission payments');
      
      let query = supabase
        .from('commission_payments')
        .select(`
          *,
          categories:category_id (name)
        `);
      
      if (period) {
        query = query.eq('period', period);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('[FINANCE SERVICE] Error fetching commission payments:', error);
        throw error;
      }
      
      console.log(`[FINANCE SERVICE] Retrieved ${data?.length || 0} commission payment records`);
      
      // Get manager details in a separate query since the join seems problematic
      const result: CommissionPayment[] = await Promise.all((data || []).map(async (item) => {
        // Get manager profile if available
        let managerName = 'Unknown';
        let managerEmail = 'unknown@example.com';
        
        if (item.manager_id) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('username, email')
            .eq('id', item.manager_id)
            .single();
            
          if (profileData) {
            const u = (profileData as any).username;
            const e = (profileData as any).email;
            managerName = typeof u === 'string' && u.trim().length > 0 ? u : 'Unknown';
            managerEmail = typeof e === 'string' && e.trim().length > 0 ? e : 'unknown@example.com';
          }
        }
          
        return {
          ...item,
          gross_income: item.gross_income || 0,
          net_income: item.net_income || 0,
          commission_amount: item.commission_amount || 0,
          payment_status: item.payment_status || 'pending',
          manager_name: managerName,
          manager_email: managerEmail,
          category_name: item.categories?.name || 'Unknown',
          is_overdue: false
        } as CommissionPayment;
      }));
      
      return result;
    } catch (error) {
      console.error('[FINANCE SERVICE] Exception in getCommissionPayments:', error);
      throw error;
    }
  }

  /**
   * Get category managers
   */
  static async getCategoryManagers(): Promise<CategoryManager[]> {
    try {
      console.log('[FINANCE SERVICE] Fetching category managers');
      
      const { data, error } = await supabase
        .from('category_managers')
        .select(`
          *,
          categories:category_id (name)
        `);
      
      if (error) {
        console.error('[FINANCE SERVICE] Error fetching category managers:', error);
        throw error;
      }
      
      console.log(`[FINANCE SERVICE] Retrieved ${data?.length || 0} category manager records`);
      
      // Get user profile data in a separate query
      const result: CategoryManager[] = await Promise.all((data || []).map(async (item) => {
        let username = 'Unknown';
        let email = 'unknown@example.com';
        
        if (item.user_id) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('username, email')
            .eq('id', item.user_id)
            .single();
            
          if (profileData) {
            const u = (profileData as any).username;
            const e = (profileData as any).email;
            username = typeof u === 'string' && u.trim().length > 0 ? u : 'Unknown';
            email = typeof e === 'string' && e.trim().length > 0 ? e : 'unknown@example.com';
          }
        }
        
        return {
          ...item,
          commission_percent: item.commission_percent || 0,
          active: item.active !== false,
          username,
          category_name: item.categories?.name || 'Unknown',
          profiles: {
            username,
            email
          },
          categories: {
            name: item.categories?.name || 'Unknown'
          }
        } as CategoryManager;
      }));
      
      return result;
    } catch (error) {
      console.error('[FINANCE SERVICE] Exception in getCategoryManagers:', error);
      throw error;
    }
  }

  /**
   * Generate commissions for a period
   * @param period - Month in YYYY-MM format
   */
  static async generateCommissions(period: string): Promise<void> {
    try {
      console.log(`[FINANCE SERVICE] Generating commissions for period: ${period}`);
      
      const { error } = await supabase
        .rpc('calculate_monthly_commissions', { month_param: period });
      
      if (error) {
        console.error('[FINANCE SERVICE] Error generating commissions:', error);
        throw error;
      }
      
      console.log('[FINANCE SERVICE] Successfully generated commissions');
    } catch (error) {
      console.error('[FINANCE SERVICE] Exception in generateCommissions:', error);
      throw error;
    }
  }

  /**
   * Update commission payment status
   * @param paymentId - ID of the commission payment
   * @param status - New payment status
   */
  static async updateCommissionStatus(
    paymentId: string,
    status: string
  ): Promise<void> {
    try {
      console.log(`[FINANCE SERVICE] Updating commission payment ${paymentId} to status ${status}`);
      
      const updateData: { payment_status: string; payment_date?: string | null } = {
        payment_status: status
      };
      
      // Add payment date when status is set to PAID
      if (status === 'paid') {
        updateData.payment_date = new Date().toISOString();
      }
      
      const { error } = await supabase
        .from('commission_payments')
        .update(updateData)
        .eq('id', paymentId);
      
      if (error) {
        console.error('[FINANCE SERVICE] Error updating commission payment status:', error);
        throw error;
      }
      
      console.log('[FINANCE SERVICE] Successfully updated commission payment status');
    } catch (error) {
      console.error('[FINANCE SERVICE] Exception in updateCommissionStatus:', error);
      throw error;
    }
  }

  /**
   * Export financial data
   * @param data - Data to export
   * @param filename - Name of the file
   */
  static exportToCSV(data: any[], filename: string): void {
    if (!data || !data.length) {
      console.error('[FINANCE SERVICE] No data to export');
      throw new Error('No data to export');
    }
    
    try {
      const headers = Object.keys(data[0])
        .filter(key => typeof data[0][key] !== 'object')
        .join(',');
      
      const csvData = data.map(row => {
        return Object.entries(row)
          .filter(([key, value]) => typeof value !== 'object')
          .map(([_, value]) => {
            if (value === null || value === undefined) return '';
            if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
            return value;
          })
          .join(',');
      }).join('\n');
      
      const csv = `${headers}\n${csvData}`;
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log(`[FINANCE SERVICE] Successfully exported ${data.length} records to ${filename}.csv`);
    } catch (error) {
      console.error('[FINANCE SERVICE] Error exporting to CSV:', error);
      throw error;
    }
  }

  /**
   * Create a default financial summary
   * @param period - Month in YYYY-MM format
   */
  static createDefaultSummary(period: string): MonthlyFinancialSummary {
    return {
      period,
      total_income: 0,
      total_expenses: 0,
      net_profit: 0,
      commissions_paid: 0,
      prize_expenses: 0
    };
  }

  /**
   * Get available periods for financial data
   * @param months - Number of months to include
   */
  static getAvailablePeriods(months: number = 12): FinancialPeriod[] {
    const periods: FinancialPeriod[] = [];
    const now = new Date();
    
    for (let i = 0; i < months; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const startDate = format(date, 'yyyy-MM-dd');
      const endDate = format(lastDayOfMonth(date), 'yyyy-MM-dd');
      const monthYear = format(date, 'MMMM yyyy');
      
      periods.push({
        startDate,
        endDate,
        label: monthYear
      });
    }
    
    return periods;
  }
}
