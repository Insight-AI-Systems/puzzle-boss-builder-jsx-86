
type ExportFormat = 'csv' | 'excel';

export const exportTableData = <T extends Record<string, any>>(
  data: T[],
  filename: string,
  format: ExportFormat = 'csv'
) => {
  if (!data.length) return;

  // Prepare the data
  const headers = Object.keys(data[0]);
  const csvData = data.map(row => 
    headers.map(header => {
      const value = row[header];
      if (typeof value === 'object') {
        return JSON.stringify(value);
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
};
