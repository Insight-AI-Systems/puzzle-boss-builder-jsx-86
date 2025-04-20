
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from '@/types/userTypes';

export function useUserExport() {
  const { toast } = useToast();

  const handleExportUsers = (users?: UserProfile[]) => {
    if (!users || users.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no users to export",
        variant: 'destructive'
      });
      return;
    }

    const headers = ["ID", "Email", "Display Name", "Role", "Country", "Categories", "Created At"];
    const rows = users.map(user => [
      user.id,
      user.email || 'N/A',
      user.display_name || 'N/A',
      user.role || 'player',
      user.country || 'Not specified',
      (user.categories_played || []).join(', '),
      new Date(user.created_at).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `users_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export successful",
      description: `Exported ${users.length} user records`
    });
  };

  return { handleExportUsers };
}
