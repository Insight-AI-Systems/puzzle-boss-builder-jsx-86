
import { SiteIncome, SiteExpense, CommissionPayment } from '@/types/financeTypes';

export async function exportFinancialData(
  incomeData: SiteIncome[],
  expenseData: SiteExpense[],
  commissionData: CommissionPayment[],
  month: string
) {
  console.log('Preparing financial export data for:', month);
  
  try {
    // Create object URLs for each data set
    const exportFiles = [
      { 
        name: `income-${month}.csv`, 
        data: convertToCSV(incomeData),
        type: 'text/csv'
      },
      { 
        name: `expenses-${month}.csv`, 
        data: convertToCSV(expenseData),
        type: 'text/csv'
      },
      { 
        name: `commissions-${month}.csv`, 
        data: convertToCSV(commissionData),
        type: 'text/csv'
      }
    ];
    
    // Create a ZIP file if JSZip is available, otherwise download individual files
    if (exportFiles.length === 1) {
      // If there's only one file, just download it directly
      downloadFile(
        exportFiles[0].data, 
        exportFiles[0].name, 
        exportFiles[0].type
      );
    } else {
      // For multiple files, download them one by one with a slight delay
      for (let i = 0; i < exportFiles.length; i++) {
        const file = exportFiles[i];
        if (file.data) {
          setTimeout(() => {
            downloadFile(file.data, file.name, file.type);
          }, i * 500); // Stagger downloads by 500ms
        }
      }
    }
    
    console.log('Financial export completed successfully');
    return true;
  } catch (err) {
    console.error('Error during financial export:', err);
    throw new Error('Failed to export financial data');
  }
}

function convertToCSV(data: any[]): string {
  if (!data || !data.length) {
    return '';
  }
  
  // Extract headers (using all keys from the first object)
  const headers = Object.keys(data[0])
    .filter(key => typeof data[0][key] !== 'object' || data[0][key] === null)
    .join(',');
  
  // Create rows - handle objects and null values
  const rows = data.map(row => {
    return Object.keys(row)
      .filter(key => typeof row[key] !== 'object' || row[key] === null)
      .map(key => {
        // Handle different value types
        const value = row[key];
        if (value === null || value === undefined) {
          return ''; // Empty string for null values
        } else if (typeof value === 'string') {
          // Escape quotes and wrap in quotes
          return `"${value.replace(/"/g, '""')}"`;
        } else {
          return value; // Numbers and booleans as-is
        }
      })
      .join(',');
  }).join('\n');
  
  return `${headers}\n${rows}`;
}

function downloadFile(data: string, fileName: string, type: string): void {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, 100);
}
