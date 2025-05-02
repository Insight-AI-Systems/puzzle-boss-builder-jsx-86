
import { 
  SiteIncome, 
  SiteExpense, 
  MonthlyFinancialSummary,
  CategoryManager,
  CommissionPayment,
  TimeFrame
} from '@/types/financeTypes';

export type FinancialPeriod = {
  startDate: string;
  endDate: string;
  label: string;
};

export type FinancialMetric = {
  label: string;
  value: number;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  prefix?: string;
  suffix?: string;
  info?: string;
};

export type FinancialMetricGroup = {
  title: string;
  metrics: FinancialMetric[];
};

export type ChartDataPoint = {
  label: string;
  value: number;
};

export type ChartSeries = {
  name: string;
  data: ChartDataPoint[];
};

export type FinancialReportConfig = {
  title: string;
  period: FinancialPeriod;
  timeframe: TimeFrame;
  includeSections: {
    summary: boolean;
    income: boolean;
    expenses: boolean;
    commissions: boolean;
  };
};

export type FinancialReport = {
  title: string;
  period: FinancialPeriod;
  summary: MonthlyFinancialSummary;
  income?: SiteIncome[];
  expenses?: SiteExpense[];
  commissions?: CommissionPayment[];
  generatedAt: Date;
};

export * from '@/types/financeTypes';
