
import JSZip from 'jszip';

type ExportFormat = 'csv' | 'excel';

export const exportTableData = <T extends Record<string, any>>(
  data: T[],
  filename: string,
  format: ExportFormat = 'csv'
) => {
  if (!data.length) return;

  try {
    // Prepare the data - handle objects and nulls properly
    const headers = Object.keys(data[0]);
    const csvData = data.map(row => 
      headers.map(header => {
        const value = row[header];
        
        // Handle different value types
        if (value === null || value === undefined) {
          return '';
        } else if (typeof value === 'object') {
          return JSON.stringify(value).replace(/"/g, '""');
        } else if (typeof value === 'string') {
          return `"${value.replace(/"/g, '""')}"`;
        }
        
        return value;
      }).join(',')
    );
    
    const csv = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (format === 'excel') {
      link.href = `data:application/vnd.ms-excel,${encodeURIComponent(csv)}`;
      link.download = `${filename}.xls`;
    } else {
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.csv`;
    }
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`Successfully exported ${data.length} records to ${filename}`);
  } catch (error) {
    console.error("Export error:", error);
    throw new Error(`Failed to export data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const exportFinancialData = async (
  incomeData: any[],
  expenseData: any[],
  commissionData: any[],
  period: string,
  format: ExportFormat = 'csv'
) => {
  console.log('Starting financial data export');
  
  if (!incomeData.length && !expenseData.length && !commissionData.length) {
    console.warn('No data available to export');
    throw new Error('No financial data available to export');
  }
  
  try {
    const zip = new JSZip();
    
    const datasets = [
      { data: incomeData, name: 'income' },
      { data: expenseData, name: 'expenses' },
      { data: commissionData, name: 'commissions' }
    ];

    console.log(`Preparing export: ${incomeData.length} income records, ${expenseData.length} expense records, ${commissionData.length} commission records`);

    datasets.forEach(({ data, name }) => {
      if (!data.length) return;

      // Clean the data for export
      const cleanData = data.map(row => {
        const cleanRow = { ...row };
        Object.keys(cleanRow).forEach(key => {
          const value = cleanRow[key as keyof typeof cleanRow];
          if (typeof value === 'object' && value !== null) {
            // @ts-ignore - we know this is safe
            cleanRow[key] = JSON.stringify(value);
          }
        });
        return cleanRow;
      });

      const headers = Object.keys(cleanData[0]);
      
      const csvData = cleanData.map(row => 
        headers.map(header => {
          const value = row[header as keyof typeof row];
          
          if (value === null || value === undefined) {
            return '';
          } else if (typeof value === 'string') {
            return `"${value.replace(/"/g, '""')}"`;
          }
          
          return value;
        }).join(',')
      );
      
      const fileContent = [headers.join(','), ...csvData].join('\n');
      const extension = format === 'excel' ? 'xls' : 'csv';
      
      zip.file(`${name}-${period}.${extension}`, fileContent);
    });

    // Generate and download the zip file
    console.log('Generating zip file...');
    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = `financial-data-${period}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('Financial data export complete');
  } catch (error) {
    console.error("Export error:", error);
    throw new Error(`Failed to export financial data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
